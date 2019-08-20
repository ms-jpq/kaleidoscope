export type Reducer<S, A> = (_: Readonly<S>, __: Readonly<A>) => S
export type Fetch<S> = () => Readonly<S>
export type Dispatch<A> = (_: Readonly<A>) => void
export type Middleware<S, A> = (_: Fetch<S>, __: Dispatch<A>) => Dispatch<A>

export const NewStore = <S, A>(
  state: S,
  reducer: Reducer<S, any>,
  middleware: Middleware<S, A> = (_, d) => (a) => d(a),
) => {
  let _state = state
  let subscribers: (() => void)[] = []
  const subscribe = (sub: () => void) => {
    subscribers = [...subscribers, sub]
    return () => ((subscribers = subscribers.filter((s) => s !== sub)), undefined)
  }
  const fetch: Fetch<S> = () => _state
  const dispatch: Dispatch<A> = middleware(fetch, (action) => {
    _state = reducer(_state, action)
    subscribers.map((s) => s())
  })
  return { subscribe, fetch, dispatch }
}

export const ApplyMiddlewares = <S, A>(
  fst: Middleware<S, A>,
  ...middlewares: Middleware<S, A>[]
) => {
  const [m1, ...m] = [fst, ...middlewares].reverse()
  return (fetch: Fetch<S>, dispatch: Dispatch<A>) =>
    m.reduce((d, middleware) => middleware(fetch, d), m1(fetch, dispatch))
}

export const ApplyReducers = <S, A>(
  fst: Reducer<S, A>,
  ...rest: Reducer<S, A>[]
): Reducer<S, A> => (state, action) =>
  rest.reduce((acc, reducer) => reducer(acc, action), fst(state, action))

export const CombineReducers = <S, A>(
  reducers: { [K in keyof S]: Reducer<S[K], any> },
): Reducer<S, A> => (state, action) =>
  Object.entries<Reducer<any, any>>(reducers).reduce(
    (acc, [key, reducer]) => ({ ...acc, [key]: reducer(state[key], action) }),
    {},
  ) as S

export type ThunkAction<S, A> = (_: Fetch<S>, __: Dispatch<A>) => void
export const NewThunkMiddleware = <E>(props: E) => <S, A>(
  fetch: Fetch<S>,
  dispatch: Dispatch<A>,
): Dispatch<A> => (action) =>
  typeof action === "function"
    ? (action as ThunkAction<S & E, A>)(() => ({ ...fetch(), ...props }), dispatch)
    : dispatch(action)

export const NewLoggerMiddleware = (...logging: ("action" | "state")[]) => <S, A>(
  fetch: Fetch<S>,
  dispatch: Dispatch<A>,
): Dispatch<A> => (action) => {
  const info = new Set(logging)
  dispatch(action)
  info.has("action") && console.log(action)
  info.has("state") && console.log(fetch())
}
