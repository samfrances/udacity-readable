/* State types */

import * as redux from "redux";

import { Post, Comment } from "../interfaces";
import { ActionTypesSynch } from "./actions";
import {
    LOAD_POSTS_SUCCESS, CREATE_POST_SUCCESS, EDIT_POST_SUCCESS, DELETE_POST_SUCCESS,
    LOAD_COMMENTS_SUCCESS, CREATE_COMMENT_SUCCESS, EDIT_COMMENT_SUCCESS,
} from "./actions/constants";

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

        case CREATE_POST_SUCCESS:
            return {
                byId: {
                    ...state.byId,
                    [action.payload.id]: action.payload,
                },
                allIds: [
                    ...state.allIds,
                    action.payload.id,
                ],
            };

        case EDIT_POST_SUCCESS:
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.payload.id]: action.payload,
                },
            };

        case DELETE_POST_SUCCESS:
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.payload.id]: action.payload,
                },
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

        case CREATE_COMMENT_SUCCESS:
            return {
                byId: {
                    ...state.byId,
                    [action.payload.id]: action.payload,
                },
                allIds: [
                    ...state.allIds,
                    action.payload.id,
                ],
            };

        case EDIT_COMMENT_SUCCESS:
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.payload.id]: action.payload,
                },
            };

        case DELETE_POST_SUCCESS:

            const orphanCommentsUpdated =
                getCommentsByPostId(state, action.payload.id)
                .map<Comment>(comment => ({ ...comment, parentDeleted: true }));

            const updatedOrphansById: { [id: string]: Comment } =
                Object.assign({},
                    ...(
                        orphanCommentsUpdated
                        .map(comment => ({
                            [comment.id]: comment,
                        }))
                    )
                );

            return {
                ...state,
                byId: {
                    ...state.byId,
                    ...updatedOrphansById,
                },
            };

        default:
            return state;

    }

}

const getCommentsByPostId: (state: CommentsState, id: Post["id"]) => Comment[] =
    (state, id) =>
        [...Object.values(state.byId)]
        .filter(comment => comment.parentId === id);

const entities = redux.combineReducers<EntitiesState>({ posts, comments });

const reducer = redux.combineReducers<ApplicationState>({ entities });

export default reducer;
