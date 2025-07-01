import { map, Observable, OperatorFunction } from 'rxjs';
import { createSelector } from './create-selector';
import { JsFunction } from './types';

// Type defintiions for rxSelectors to add type check 
// for typescript project up to 9 selector arguments
// @internal
export function rxSelect<T, T1, R>(
  func1: JsFunction<T1>,
  output: (source1: T1) => R
): OperatorFunction<T, R>;

// @internal
export function rxSelect<T, T1, T2, R>(
  func1: JsFunction<T1>,
  func2: JsFunction<T2>,
  output: (source1: T1, source2: T2) => R
): OperatorFunction<T, R>;

// @internal
export function rxSelect<T, T1, T2, T3, R>(
  func1: JsFunction<T1>,
  func2: JsFunction<T2>,
  func3: JsFunction<T3>,
  output: (source1: T1, source2: T2, source3: T3) => R
): OperatorFunction<T, R>;

// @internal
export function rxSelect<T, T1, T2, T3, T4, R>(
  func1: JsFunction<T1>,
  func2: JsFunction<T2>,
  func3: JsFunction<T3>,
  func4: JsFunction<T4>,
  output: (source1: T1, source2: T2, source3: T3, source4: T4) => R
): OperatorFunction<T, R>;

// @internal
export function rxSelect<T, T1, T2, T3, T4, T5, R>(
  func1: JsFunction<T1>,
  func2: JsFunction<T2>,
  func3: JsFunction<T3>,
  func4: JsFunction<T4>,
  func5: JsFunction<T5>,
  output: (source1: T1, source2: T2, source3: T3, source4: T4, source5: T5) => R
): OperatorFunction<T, R>;

// @internal
export function rxSelect<T, T1, T2, T3, T4, T5, T6, R>(
  func1: JsFunction<T1>,
  func2: JsFunction<T2>,
  func3: JsFunction<T3>,
  func4: JsFunction<T4>,
  func5: JsFunction<T5>,
  func6: JsFunction<T6>,
  output: (
    source1: T1,
    source2: T2,
    source3: T3,
    source4: T4,
    source5: T5,
    source6: T6
  ) => R
): OperatorFunction<T, R>;

// @internal
export function rxSelect<T, T1, T2, T3, T4, T5, T6, T7, R>(
  func1: JsFunction<T1>,
  func2: JsFunction<T2>,
  func3: JsFunction<T3>,
  func4: JsFunction<T4>,
  func5: JsFunction<T5>,
  func6: JsFunction<T6>,
  func7: JsFunction<T7>,
  output: (
    source1: T1,
    source2: T2,
    source3: T3,
    source4: T4,
    source5: T5,
    source6: T6,
    source7: T7
  ) => R
): OperatorFunction<T, R>;

// @internal
export function rxSelect<T, T1, T2, T3, T4, T5, T6, T7, T8, R>(
  func1: JsFunction<T1>,
  func2: JsFunction<T2>,
  func3: JsFunction<T3>,
  func4: JsFunction<T4>,
  func5: JsFunction<T5>,
  func6: JsFunction<T6>,
  func7: JsFunction<T7>,
  func8: JsFunction<T8>,
  output: (
    source1: T1,
    source2: T2,
    source3: T3,
    source4: T4,
    source5: T5,
    source6: T6,
    source7: T7,
    source8: T8
  ) => R
): OperatorFunction<T, R>;

// @internal
export function rxSelect<T, T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(
  func1: JsFunction<T1>,
  func2: JsFunction<T2>,
  func3: JsFunction<T3>,
  func4: JsFunction<T4>,
  func5: JsFunction<T5>,
  func6: JsFunction<T6>,
  func7: JsFunction<T7>,
  func8: JsFunction<T8>,
  func9: JsFunction<T9>,
  output: (
    source1: T1,
    source2: T2,
    source3: T3,
    source4: T4,
    source5: T5,
    source6: T6,
    source7: T7,
    source8: T8,
    source9: T9
  ) => R
): OperatorFunction<T, R>;

/**
 * Creates an rxjs {@see https://rxjs.dev/guide/operators} operator function
 *
 * **Note**
 * It generates memoized selector functions.
 * It accepts one or more "input" selectors, which extract values from the input
 * observable, and an "output" selector [a.k.a the last function in the list of 
 * arguments] that receives the extracted values and should return a derived value.
 * If developper subscribe to the observabled multiple times, the output will only
 * be recalculated when the extracted values have changed.
 * 
 * ```js
 * // (1) implementation
 * const observable$ = state$.pipe( // (1)
      rxSelect<number>(
        computation1,
        computatation2,
        (subtotal: number, taxPercent: number) => {
          return subtotal * (taxPercent / 100);
        }
      )
    );
    observable$.subscribe();
    observable$.subscribe();

    // is similar to (2)
    const observable2$ = state$.pipe( // (2)
      map((state) => {
        return ((subtotal: number, taxPercent: number) =>
          subtotal * (taxPercent / 100))(
          computation1(state),
          computatation2(state)
        );
      })
    );
    observable2$.subscribe();
    observable2$.subscribe();

    // With the exception that in the case of (2), the map transformation
    // is runs on every subscription while in case (1) it's only run when the source
    // observable input changes [in this case only once]
 * ```
 *
 * @param selectors
 */
export function rxSelect<R>(...selectors: JsFunction[]) {
  const select = createSelector(...selectors);
  return <T>(source$: Observable<T>) => {
    return source$.pipe(map((state) => select(state) as R));
  };
}
