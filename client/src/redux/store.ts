import {
    combineReducers,
    configureStore,
    ThunkAction,
    Action,
    ThunkDispatch,
    getDefaultMiddleware,
} from "@reduxjs/toolkit";
import auth from "./splices/auth";

// * Configure Reducers
export const rootReducer = combineReducers({ auth });

export type RootState = ReturnType<typeof rootReducer>;

// * Configure Store
const store = configureStore({
    middleware: getDefaultMiddleware(),
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export type AppStore = typeof store;

export default store;
