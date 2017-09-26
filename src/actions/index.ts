import * as redux from "redux";
import * as thunk from "redux-thunk";
import * as uuid4 from "uuid/v4";

import * as api from "../utils/api";

import { ApplicationState } from "../state";

import { Post, Comment, Category } from "../interfaces";

/* Constants */

export type ActionTypesSynch =
    | LoadPostsStart
    | LoadPostsSuccess
    | LoadCommentsStart
    | LoadCommentsSuccess
    | CreatePostStart
    | CreatePostSuccess;

export type ActionTypesAsync =
    | LoadPostsAsync
    | LoadCommentsAsync
    | CreatePostAsync;

export type LOAD_POSTS_START = "LOAD_POSTS_START";
export const LOAD_POSTS_START = "LOAD_POSTS_START";

export type LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";

export type LOAD_COMMENTS_START = "LOAD_COMMENTS_START";
export const LOAD_COMMENTS_START = "LOAD_COMMENTS_START";

export type LOAD_COMMENTS_SUCCESS = "LOAD_COMMENTS_SUCCESS";
export const LOAD_COMMENTS_SUCCESS = "LOAD_COMMENTS_SUCCESS";

export type CREATE_POST_START = "CREATE_POST_START";
export const CREATE_POST_START = "CREATE_POST_START";

export type CREATE_POST_SUCCESS = "CREATE_POST_SUCCESS";
export const CREATE_POST_SUCCESS = "CREATE_POST_SUCCESS";

/* Generic action types */

interface SimpleFSA<T, P> {
    type: T;
    payload: P;
}

/* Synchronous action types */

export interface LoadPostsStart { type: LOAD_POSTS_START; }

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

export type CreatePostStart = SimpleFSA<CREATE_POST_START, api.PostInit>;

export type CreatePostSuccess = SimpleFSA<CREATE_POST_SUCCESS, Post>;

/* Synchronous action creators */

export const loadPostsStart: () => LoadPostsStart =
    () =>  ({ type: LOAD_POSTS_START });

export const loadPostsSuccess: (posts: Post[]) => LoadPostsSuccess =
    posts => ({
        type: LOAD_POSTS_SUCCESS,
        payload: { posts },
    });

export const loadCommentsStart: (posts: Post[]) => LoadCommentsStart =
    posts => ({
        type: LOAD_COMMENTS_START,
        payload: { posts },
    });

export const loadCommentsSuccess: (comments: Comment[]) => LoadCommentsSuccess =
    comments => ({
        type: LOAD_COMMENTS_SUCCESS,
        payload: { comments },
    });

export const createPostStart: (payload: api.PostInit) => CreatePostStart =
    payload => ({
        type: CREATE_POST_START,
        payload,
    });

export const createPostSuccess: (post: Post) => CreatePostSuccess =
    post => ({
        type: CREATE_POST_SUCCESS,
        payload: post,
    });

/* Asynchronous action types */

type dispatchFunc = redux.Dispatch<ApplicationState>;

type getStateFunc = () => ApplicationState;

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

export type CreatePostAsync = thunk.ThunkAction<
    Promise<CreatePostSuccess>,
    ApplicationState,
    {}
>;

/* Asynchronous action creators */

export const loadPostsAsync: () => LoadPostsAsync =
    () => async (dispatch: dispatchFunc, getState: getStateFunc) => {
        dispatch(loadPostsStart());
        const posts = await api.allPosts();
        return dispatch(loadPostsSuccess(posts));
    };

export const loadCommentsAsync: () => LoadCommentsAsync =
    () => async (dispatch: dispatchFunc, getState: getStateFunc) => {
        const posts = Object.values(getState().entities.posts.byId);
        dispatch(loadCommentsStart(posts));

        const comments: Comment[] = await (async () => {
            const commentLists: Comment[][] = await Promise.all(
                posts.map(post => api.commentsByPostId(post.id))
            );
            // flatten list of list of comments
            return ([] as Comment[]).concat(...commentLists);
        })();

        return dispatch(loadCommentsSuccess(comments));
    };

export function createPostAsync(
    details: Pick<Post, "title"|"body"|"author"|"category">
): CreatePostAsync {
    return async (dispatch: dispatchFunc, getState: getStateFunc) => {

        const id = uuid4();
        const timestamp = Date.now();
        const postInit = {...details, id, timestamp};

        dispatch(createPostStart(postInit));
        const post = await api.publishPost(postInit);
        return dispatch(createPostSuccess(post));
    };
}
