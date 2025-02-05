import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { counterSlice } from "../features/counter/counterSlice"
import { quotesApiSlice } from "../features/quotes/quotesApiSlice"
import pokemonReducer from "../features/poketable/pokemonSlice"

// `combineSlices` automatically combines the reducers
const rootReducer = combineSlices(counterSlice, quotesApiSlice, { pokemon: pokemonReducer })

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(quotesApiSlice.middleware),
    preloadedState,
  })
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()
export type RootState = ReturnType<typeof rootReducer>
export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
