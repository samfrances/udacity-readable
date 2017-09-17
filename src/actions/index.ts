import * as uuid4 from "uuid/v4";
import * as redux from "redux";
import * as thunk from "redux-thunk";

import { allPosts, commentsByPostId } from "../utils/api";

import { ApplicationState } from "../state";

import { Post, Comment, Category } from "../interfaces"

/* Constants */

export type ActionTypesSynch =
    | LoadPostsStart
    | LoadPostsSuccess
    | LoadCommentsStart
    | LoadCommentsSuccess;

export type ActionTypesAsync =
    | LoadPostsAsync
    | LoadCommentsAsync;

type LOAD_POSTS_START = "LOAD_POSTS_START";
const LOAD_POSTS_START = "LOAD_POSTS_START";

type LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";

type LOAD_COMMENTS_START = "LOAD_COMMENTS_START";
const LOAD_COMMENTS_START = "LOAD_COMMENTS_START";

type LOAD_COMMENTS_SUCCESS = "LOAD_COMMENTS_SUCCESS";
const LOAD_COMMENTS_SUCCESS = "LOAD_COMMENTS_SUCCESS";

/* Generic action types */

interface SimpleFSA<T, P> {
    type: T;
    payload: P;
}

/* Synchronous action types */

export interface LoadPostsStart {type: LOAD_POSTS_START};

export type LoadPostsSuccess = SimpleFSA<
    LOAD_POSTS_SUCCESS,
    { posts: Post[] }
>;

export type LoadCommentsStart = SimpleFSA<
    LOAD_COMMENTS_START,
    { posts: Post[]}
>;

export type LoadCommentsSuccess = SimpleFSA<
    LOAD_COMMENTS_SUCCESS,
    { comments: Comment[]}
>;

/* Synchronous action creators */

export const loadPostsStart: () => LoadPostsStart =
    () =>  ({ type: LOAD_POSTS_START });

export const loadPostsSuccess: (posts: Post[]) => LoadPostsSuccess =
    (posts) => ({
        type: LOAD_POSTS_SUCCESS,
        payload: { posts }
    });

export const loadCommentsStart: (posts: Post[]) => LoadCommentsStart =
    (posts) => ({
        type: LOAD_COMMENTS_START,
        payload: { posts }
    });

export const loadCommentsSuccess: (comments: Comment[]) => LoadCommentsSuccess =
    (comments) => ({
        type: LOAD_COMMENTS_SUCCESS,
        payload: { comments },
    });

/* Asynchronous action types */

type dispatch = redux.Dispatch<ApplicationState>;

type getState = () => ApplicationState;

export type LoadPostsAsync = thunk.ThunkAction<
    Promise<LoadPostsSuccess>,
    ApplicationState,
    {}
>;

export type LoadCommentsAsync = thunk.ThunkAction<
    Promise<LoadCommentsSuccess>,
    ApplicationState,
    {}
>;

/* Asynchronous action creators */

export const loadPostsAsync: () => LoadPostsAsync =
    () => async (dispatch: dispatch, getState: getState) => {
        dispatch(loadPostsStart());
        const posts = await allPosts();
        return dispatch(loadPostsSuccess(posts));
    };

export const loadCommentsAsync: () => LoadCommentsAsync =
    () => async (dispatch: dispatch, getState: getState) => {
        const posts = Object.values(getState().entities.posts.byId)
        dispatch(loadCommentsStart(posts));

        const comments: Comment[] = await (async () => {
            const commentLists: Comment[][] = await Promise.all(
                posts.map(post => commentsByPostId(post.id))
            )
            // flatten list of list of comments
            return [].concat.apply(commentLists);
        })();

        return dispatch(loadCommentsSuccess(comments));
    };
