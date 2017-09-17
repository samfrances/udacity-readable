/* State types */

import * as redux from "redux";
import thunk from "redux-thunk";

import { Post, Comment } from "./interfaces";
import {
    ActionTypesSynch,
    ActionTypesAsync,
    LOAD_POSTS_SUCCESS,
    LOAD_COMMENTS_SUCCESS,
} from "./actions";

interface EntityIndex<T> {
    byId: {
        [id: string]: T;
    };
    allIds: string[];
}

type PostsState = EntityIndex<Post>;

type CommentsState = EntityIndex<Comment>;

interface EntitiesState {
    posts: PostsState;
    comments: CommentsState;
}

export interface ApplicationState {
    entities: EntitiesState;
}

export interface ApplicationStore {
    dispatch(action: ActionTypesSynch): ActionTypesSynch;
    dispatch(action: ActionTypesAsync): Promise<ActionTypesAsync>;
    getState(): ApplicationState;
    subscribe(listener: () => void): redux.Unsubscribe;
    replaceReducer(nextReducer: redux.Reducer<ApplicationState>): void;
}

/* Initial state */

const getEmptyIndex: <E>() => EntityIndex<E> =
    () => ({
        byId: {},
        allIds: [],
    });

const getInitialState: () => ApplicationState =
    () => ({
        entities: {
            posts: getEmptyIndex<Post>(),
            comments: getEmptyIndex<Comment>(),
        },
    });

/* Reducers */

function posts(
    state: PostsState = getEmptyIndex<Post>(),
    action: ActionTypesSynch,
): PostsState {
    switch (action.type) {

        case LOAD_POSTS_SUCCESS:
            return {
                byId: Object.assign({},
                    ...action.payload.posts.map( post => ({ [post.id]: post }) )
                ),
                allIds: action.payload.posts.map(post => post.id),
            };

        default:
            return state;
    }
}

function comments(
    state: CommentsState = getEmptyIndex<Comment>(),
    action: ActionTypesSynch,
): CommentsState {

    switch (action.type) {

        case LOAD_COMMENTS_SUCCESS:
            return {
                byId: Object.assign({},
                    ...action.payload.comments.map(
                        comment => ({ [comment.id]: comment })
                    )
                ),
                allIds: action.payload.comments.map(post => post.id),
            };

        default:
            return state;

    }

}

const entities = redux.combineReducers<EntitiesState>({ posts, comments });

/* Store creation */

export function storeFactory(): ApplicationStore {
    return redux.createStore(
        redux.combineReducers({ entities }),
        getInitialState(),
        redux.applyMiddleware(thunk),
    );
}
