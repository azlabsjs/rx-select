# Package documentation

A library for creating memoized "selector" functions with an extension to the popular RxJS [https://rxjs.dev] library.

## Basic usage

At it basic use case the library offers a global function `rxSelect` which accepts one or more "input" selectors, which extract values from the input observable, and an "output" selector [a.k.a the last function in the list of arguments] that receives the extracted values and should return a derived value.

If developper subscribe to the observable multiple times, the output will only
be recalculated when the extracted values have changed [a.k.a when the observable input changes].

```js
const observable$ = state$.pipe( // (1)
    rxSelect < number > (
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
```

## API

Internally this library a function for creating selectors that works on non observable state.

### createSelector(...inputSelector, outputFunction, options?)

The `createSelector` API Accepts one or more "input selectors" (as separate arguments), a single "output selector" / "result function", and an optional options object, and generates a memoized selector function.

When the selector is called, each input selector will be called with all of the provided arguments. The extracted values are then passed as separate arguments to the output selector, which should calculate and return a final result. The inputs and result are cached for later use.

If the selector is called again with the same arguments, the previously cached result is returned instead of recalculating a new result.

```js
let totalCalls = 0;
let totalObservableCalls = 0;
const state$ = of ({
    shop: {
        taxPercent: 8,
        items: [{
                name: 'Lenovo',
                value: 1.2
            },
            {
                name: 'iMac',
                value: 0.95
            },
        ],
    },
});
const computation1 = (state: any) =>
    state.shop.items.reduce(
        (subtotal: number, item: any) => subtotal + item.value,
        0
    );

// Heavy computational task
const computatation2 = (state: any) => {
    totalCalls++;
    return state.shop.taxPercent;
};

const selector = createSelector(
    computation1,
    computation2,
    // Output selector function
    (subtotal: number, taxPercent: number) => {
        return subtotal * (taxPercent / 100);
    }
);

// Call the memoized function
selector({
    // ... state
});
// Recalculate the output only if the state has changes
selector({
    // ... state
});
```

**Note**
By default the selector used default configuration for meoization which is a shallow equality compartor function to check if the result should be recalculated.

To provides your custom configuration:

```js
// Example passing memoization options
const customizedSelector = createSelector(
    state => state.a,
    state => state.b,
    (a, b) => a + b, 
    {
        // Memoization options passed as last argument to
        // modify configurations for internal memoize function
        // implementation
        memoize: {
            // Using strict equality with a cache size of 10 which will
            // retains the last 10 computed values
            equality: {
                fn: (a, b) => a === b,
                size: 10
            },
        }
    }
)
```
