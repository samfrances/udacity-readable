import * as redux from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
    ActionTypesSynch,
    AsyncAppAction,
    ResultActionTypes,
} from "./actions";

import reducer, { ApplicationState, getInitialState } from "./reducers";

export interface ActionTypedDispatch<ACTION_TYPES> {
    <A extends ACTION_TYPES>(action: A): A;
}

export interface ActionTypedDispatch<ACTION_TYPES> {
    <R, S, E>(asyncAction: ActionTypedThunkAction<ACTION_TYPES, R, S, E>): R;
}

export type ActionTypedThunkAction<A, R, S, E> = (
    dispatch: ActionTypedDispatch<A>,
    getState: () => S,
    extraArgument: E
) => R;

export interface ActionTypedStore<ACTION_TYPES, STATE> {
    dispatch: ActionTypedDispatch<ACTION_TYPES>;
    getState(): STATE;
    subscribe(listener: () => void): redux.Unsubscribe;
    replaceReducer(nextReducer: redux.Reducer<ApplicationState>): void;
}


/* Store creation */

export function storeFactory(): ActionTypedStore<ActionTypesSynch, ApplicationState> {

    const initialState = getInitialState();

    const enhancer = composeWithDevTools(redux.applyMiddleware(thunk));

    return redux.createStore<ApplicationState>(reducer, initialState, enhancer);
}
