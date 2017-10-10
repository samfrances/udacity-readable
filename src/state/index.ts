import * as redux from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import { ActionTypes } from "./actions";
import { ActionTypedStore } from "./helpers";

import reducer, { ApplicationState, getInitialState } from "./reducers";


/* Store creation */

export function storeFactory(): ActionTypedStore<ActionTypes, ApplicationState> {

    const initialState = getInitialState();

    const enhancer = composeWithDevTools(redux.applyMiddleware(thunk));

    return redux.createStore<ApplicationState>(reducer, initialState, enhancer);
}
