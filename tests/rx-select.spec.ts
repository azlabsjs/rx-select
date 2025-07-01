import { interval, lastValueFrom, of } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { createSelector } from '../src';
import { rxSelect } from '../src/select';
import { JsFunction } from '../src/types';

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownType = any;

describe('rx-Select test', () => {
  it('should evaluate to true', async () => {
    const state$ = of({
      shop: {
        taxPercent: 8,
        items: [
          { name: 'apple', value: 1.2 },
          { name: 'orange', value: 0.95 },
        ],
      },
    });

    const observable$ = state$.pipe(
      rxSelect(
        createSelector(
          (state: UnknownType) => state.shop.items,
          (items: UnknownType[]) =>
            items.reduce((subtotal, item) => subtotal + item.value, 0)
        ) as JsFunction<number>,
        (state) => state.shop.taxPercent,
        (subtotal: number, taxPercent: number) => subtotal * (taxPercent / 100)
      ),
      tap((state) => expect(state).toEqual(0.172))
    );
    observable$.subscribe();
    // Simulate a wait for the test to complete
    await lastValueFrom(interval(1500).pipe(first()));
  });

  it('should expect the selector functions to be called once even if observable is subscribed once, when the input state does not change', async () => {
    let totalCalls = 0;
    let totalObservableCalls = 0;
    const state$ = of({
      shop: {
        taxPercent: 8,
        items: [
          { name: 'apple', value: 1.2 },
          { name: 'orange', value: 0.95 },
        ],
      },
    });
    const computation1 = (state: UnknownType) =>
      state.shop.items.reduce(
        (subtotal: number, item: UnknownType) => subtotal + item.value,
        0
      );

    // Heavy computational task
    const computatation2 = (state: UnknownType) => {
      totalCalls++;
      return state.shop.taxPercent;
    };

    const observable$ = state$.pipe(
      rxSelect(
        computation1,
        computatation2,
        (subtotal: number, taxPercent: number) => {
          return subtotal * (taxPercent / 100);
        }
      ),
      tap((state) => {
        totalObservableCalls++;
        expect(state).toEqual(0.172);
      })
    );
    observable$.subscribe();
    observable$.subscribe();
    observable$.subscribe();
    observable$.subscribe();
    observable$.subscribe();
    observable$.subscribe();

    // Simulate a wait for the test to complete
    await lastValueFrom(
      interval(2000).pipe(
        first(),
        tap(() => {
          expect(totalCalls).toEqual(1);
          expect(totalObservableCalls).toEqual(6);
        })
      )
    );
  });
});
