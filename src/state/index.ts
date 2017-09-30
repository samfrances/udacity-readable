import * as redux from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
    ActionTypesSynch,
    ActionTypesAsync,
} from "./actions";

import reducer, { ApplicationState } from "./reducers";


export interface ApplicationStore {
    dispatch(action: ActionTypesSynch): ActionTypesSynch;
    dispatch(action: ActionTypesAsync): Promise<ActionTypesAsync>;
    getState(): ApplicationState;
    subscribe(listener: () => void): redux.Unsubscribe;
    replaceReducer(nextReducer: redux.Reducer<ApplicationState>): void;
}

/* Store creation */

export function storeFactory(): ApplicationStore {

    const enhancer = composeWithDevTools(redux.applyMiddleware(thunk));

    return redux.createStore<ApplicationState>(reducer, enhancer);
}
