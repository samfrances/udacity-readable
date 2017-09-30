import * as redux from "redux";
import * as thunk from "redux-thunk";
import * as uuid4 from "uuid/v4";

import * as api from "../../utils/api";
import { ApplicationState } from "../reducers";
import { Post, Comment, Category } from "../../interfaces";
import {
    LOAD_POSTS_START, LOAD_POSTS_SUCCESS, LOAD_COMMENTS_START, LOAD_COMMENTS_SUCCESS,
    CREATE_POST_START, CREATE_POST_SUCCESS, CREATE_COMMENT_START, CREATE_COMMENT_SUCCESS,
} from "./constants";

/* Constants */

export type ActionTypesSynch =
    | LoadPostsStart
    | LoadPostsSuccess
    | LoadCommentsStart
    | LoadCommentsSuccess
    | CreatePostStart
    | CreatePostSuccess
    | CreateCommentStart
    | CreateCommentSuccess;

export type ResultActionTypes =
    | LoadPostsSuccess
    | LoadCommentsSuccess
    | CreatePostSuccess
    | CreateCommentSuccess;


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

export type CreateCommentStart = SimpleFSA<CREATE_COMMENT_START, api.CommentInit>;

export type CreateCommentSuccess = SimpleFSA<CREATE_COMMENT_SUCCESS, Comment>;

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

export const createCommentStart: (payload: api.CommentInit) => CreateCommentStart =
    payload => ({
        type: CREATE_COMMENT_START,
        payload,
    });

export const createCommentSuccess: (comment: Comment) => CreateCommentSuccess =
    comment => ({
        type: CREATE_COMMENT_SUCCESS,
        payload: comment,
    });

/* Asynchronous action types */

export type AsyncAppAction<R extends ResultActionTypes> = thunk.ThunkAction<
    Promise<R>,
    ApplicationState,
    {}
>;

export type LoadPostsAsync = AsyncAppAction<LoadPostsSuccess>;
export type LoadCommentsAsync = AsyncAppAction<LoadCommentsSuccess>;
export type CreatePostAsync = AsyncAppAction<CreatePostSuccess>;
export type CreateCommentAsync = AsyncAppAction<CreateCommentSuccess>;

/* Asynchronous action creators */

export const loadPostsAsync: () => LoadPostsAsync =
    () => async (dispatch, getState) => {
        dispatch(loadPostsStart());
        const posts = await api.allPosts();
        return dispatch(loadPostsSuccess(posts));
    };

export const loadCommentsAsync: () => LoadCommentsAsync =
    () => async (dispatch, getState) => {
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


export const createPostAsync: (
    details: Pick<api.PostInit, "title"|"body"|"author"|"category">
) => CreatePostAsync =
    details => async (dispatch, getState) => {

        const id = uuid4();
        const timestamp = Date.now();
        const postInit = {...details, id, timestamp};

        dispatch(createPostStart(postInit));
        const post = await api.publishPost(postInit);
        return dispatch(createPostSuccess(post));
    };

export const createCommentAsync: (
    details: Pick<api.CommentInit, "body"|"author"|"parentId">
) => CreateCommentAsync =
    details => async (dispatch, getState) => {

        const id = uuid4();
        const timestamp = Date.now();
        const commentInit = {...details, id, timestamp};

        dispatch(createCommentStart(commentInit));
        const comment = await api.publishComment(commentInit);
        return dispatch(createCommentSuccess(comment));
    };
