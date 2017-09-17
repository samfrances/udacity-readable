/* State types */

import * as redux from "redux";
import thunk from 'redux-thunk';

import { Post, Comment } from "./interfaces";
import { ActionTypesSynch, ActionTypesAsync } from "./actions";

interface EntityIndex<T> {
    byId: {
        [id: string]: T;
    };
    allIds: string[];
}

export interface ApplicationState {
    entities: {
        posts: EntityIndex<Post>;
        comments: EntityIndex<Comment>;
    };
}

export interface ApplicationStore {
    dispatch(action: ActionTypesSynch): ActionTypesSynch;
    dispatch(action: ActionTypesAsync): Promise<ActionTypesAsync>;
    getState(): ApplicationState;
    subscribe(listener: () => void): redux.Unsubscribe;
    replaceReducer(nextReducer: redux.Reducer<ApplicationState>): void;
}

/* Initial state */

const getInitialState: () => ApplicationState =
    () => ({
        entities: {
            posts: {
                byId: {},
                allIds: []
            },
            comments: {
                byId: {},
                allIds: []
            }
        }
    });

/* Reducers */

function myReducer(state: ApplicationState, action: ActionTypesSynch): ApplicationState {
    return state;
}

function storeFactory (): ApplicationStore {
    return redux.createStore(
        myReducer,
        getInitialState(),
        redux.applyMiddleware(thunk)
    );
}