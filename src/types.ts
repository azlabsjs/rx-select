/** @internal */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownType = any;

// createSelector types
// @internal
export type LeastType<T> = T extends [unknown, ...infer U] ? U[0] : never;

// @internal
export type CreateSelectorOptions<T> = {
  memoize?: T;
};
/** A standard selector function, which takes three generic type arguments:
 * @param State The first value, often a Redux root state object
 * @param Result The final result returned by the selector
 * @param Params All additional arguments passed into the selector
 */
export type SelectorType<
  // The state can be anything
  State = UnknownType,
  // The result will be inferred
  Result = unknown,
  // There are either 0 params, or N params
  Params extends never | readonly UnknownType[] = UnknownType[],
  // If there are 0 params, type the function as just State in, Result out.
  // Otherwise, type it as State + Params in, Result out.
> = [Params] extends [never]
  ? (state: State) => Result
  : (state: State, ...params: Params) => Result;
// !Ends createSelector types
// !Ends Types

export type JsFunction<T = unknown> = (...args: UnknownType[]) => T | (() => T);
