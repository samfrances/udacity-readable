import * as redux from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
    ActionTypesSynch,
    AsyncAppAction,
    ResultActionTypes,
} from "./actions";

import reducer, { ApplicationState, getInitialState } from "./reducers";


export interface ApplicationStore {
    dispatch<A extends ActionTypesSynch>(action: A): A;
    dispatch<R extends ResultActionTypes>(action: AsyncAppAction<R>): Promise<R>;
    getState(): ApplicationState;
    subscribe(listener: () => void): redux.Unsubscribe;
    replaceReducer(nextReducer: redux.Reducer<ApplicationState>): void;
}

/* Store creation */

export function storeFactory(): ApplicationStore {

    const initialState = getInitialState();

    const enhancer = composeWithDevTools(redux.applyMiddleware(thunk));

    return redux.createStore<ApplicationState>(reducer, initialState, enhancer);
}


