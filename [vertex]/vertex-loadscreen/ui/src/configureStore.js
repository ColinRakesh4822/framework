import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";
import createReducer from "./reducers";

export default function configureStore(initialState) {
  const store = createStore(
    createReducer(),
    initialState,
    applyMiddleware(thunk)
  );

  // Vite HMR
  if (import.meta.hot) {
    import.meta.hot.accept("./reducers", (m) => {
      const nextCreateReducer = m?.default || createReducer;
      store.replaceReducer(nextCreateReducer());
    });
  }

  return store;
}
