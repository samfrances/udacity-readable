/* Module for random experiments */

import * as actions from "./actions";
import * as state from "./state";
import * as redux from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';

export interface ReadableAppStore {
    dispatch(action: actions.ActionTypesSync): actions.ActionTypesSync;
    dispatch<E>(action: actions.ActionTypesAsync<E>): Promise<actions.ActionTypesSync>;
    getState(): state.IApplicationState;
    subscribe(listener: () => void): redux.Unsubscribe;
    replaceReducer(nextReducer: redux.Reducer<state.IApplicationState>): void;
};

//const reducer = function(state: state.IApplicationState, action)


// interface MyStore extends redux.Store<state.IApplicationState> {
//     dispatch<A extends MyAction>(action: A): A;
// }

// const reducer = function(state: MyState, action: MyAction) {
//     return {counter: state.counter + 1};
// }

// const store: MyStore = redux.createStore(reducer, {counter: 5});

// store.dispatch({ type: "hello" })
// console.log(store.getState())

