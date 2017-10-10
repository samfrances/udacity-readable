import * as redux from "redux";
import * as thunk from "redux-thunk";
import * as uuid4 from "uuid/v4";

import * as api from "../../utils/api";
import { ApplicationState } from "../reducers";
import { Post, Comment, Category } from "../../interfaces";
import {
    LOAD_POSTS_START, LOAD_POSTS_SUCCESS, LOAD_COMMENTS_START, LOAD_COMMENTS_SUCCESS,
    CREATE_POST_START, CREATE_POST_SUCCESS, CREATE_COMMENT_START, CREATE_COMMENT_SUCCESS,
    EDIT_POST_START, EDIT_POST_SUCCESS, EDIT_COMMENT_START, EDIT_COMMENT_SUCCESS,
    DELETE_POST_START, DELETE_POST_SUCCESS, DELETE_COMMENT_START, DELETE_COMMENT_SUCCESS,
    VOTE_START, VOTE_SUCCESS,
} from "./constants";

import { SimpleFSA } from "../helpers";

/* Constants */

export type ActionTypesSynch =
    | LoadPostsStart
    | LoadPostsSuccess
    | LoadCommentsStart
    | LoadCommentsSuccess
    | CreatePostStart
    | CreatePostSuccess
    | CreateCommentStart
    | CreateCommentSuccess
    | EditPostStart
    | EditPostSuccess
    | EditCommentStart
    | EditCommentSuccess
    | DeletePostStart
    | DeletePostSuccess
    | DeleteCommentStart
    | DeleteCommentSuccess
    | VoteStart
    | VoteSuccess<Post>
    | VoteSuccess<Comment>;

export type ResultActionTypes =
    | LoadPostsSuccess
    | LoadCommentsSuccess
    | CreatePostSuccess
    | CreateCommentSuccess
    | EditPostSuccess
    | EditCommentSuccess
    | DeletePostSuccess
    | DeleteCommentSuccess
    | VoteSuccess<Post>
    | VoteSuccess<Comment>;


// -----------------------------------------------------------------------------
//  Synchronous actions, action types and action creators
// -----------------------------------------------------------------------------

/* Loading posts */

interface LoadPostsStart { type: LOAD_POSTS_START; payload: undefined; }
export const loadPostsStart: () => LoadPostsStart =
    () =>  ({ type: LOAD_POSTS_START, payload: undefined });

type LoadPostsSuccess = SimpleFSA<LOAD_POSTS_SUCCESS, { posts: Post[] }>;
export const loadPostsSuccess: (posts: Post[]) => LoadPostsSuccess =
    posts => ({
        type: LOAD_POSTS_SUCCESS,
        payload: { posts },
    });

/* Creating new post */

type PostInitFields = Pick<Post, "id"|"timestamp"|"title"|"body"|"author"|"category">;
type CreatePostStart = SimpleFSA<CREATE_POST_START, PostInitFields>;
export const createPostStart: (payload: PostInitFields) => CreatePostStart =
    payload => ({
        type: CREATE_POST_START,
        payload,
    });


type CreatePostSuccess = SimpleFSA<CREATE_POST_SUCCESS, Post>;
export const createPostSuccess: (post: Post) => CreatePostSuccess =
    post => ({
        type: CREATE_POST_SUCCESS,
        payload: post,
    });

/* Edit post */

type PostEditFields = Pick<Post, "id"|"title"|"body">;
type EditPostStart = SimpleFSA<EDIT_POST_START, PostEditFields>;
export const editPostStart: (payload: PostEditFields) => EditPostStart =
    payload => ({
        type: EDIT_POST_START,
        payload,
    });

type EditPostSuccess = SimpleFSA<EDIT_POST_SUCCESS, Post>;
export const editPostSuccess: (post: Post) => EditPostSuccess =
    post => ({
        type: EDIT_POST_SUCCESS,
        payload: post,
    });

/* Delete post */

type PostDeleteFields = Pick<Post, "id">;
type DeletePostStart = SimpleFSA<DELETE_POST_START, PostDeleteFields>;
export const deletePostStart: (payload: Pick<Post, "id">) => DeletePostStart =
    payload => ({
        type: DELETE_POST_START,
        payload,
    });

type DeletePostSuccess = SimpleFSA<DELETE_POST_SUCCESS, Post>;
export const deletePostSuccess: (post: Post) => DeletePostSuccess =
    post => ({
        type: DELETE_POST_SUCCESS,
        payload: post,
    });


/* Loading comments */

type LoadCommentsStart = SimpleFSA<LOAD_COMMENTS_START, { posts: Post[]}>;
export const loadCommentsStart: (posts: Post[]) => LoadCommentsStart =
    posts => ({
        type: LOAD_COMMENTS_START,
        payload: { posts },
    });

type LoadCommentsSuccess = SimpleFSA<LOAD_COMMENTS_SUCCESS, { comments: Comment[]}>;
export const loadCommentsSuccess: (comments: Comment[]) => LoadCommentsSuccess =
    comments => ({
        type: LOAD_COMMENTS_SUCCESS,
        payload: { comments },
    });


/* Create new comment */

type CommentInitFields = Pick<Comment, "id"|"timestamp"|"body"|"author"|"parentId">;
type CreateCommentStart = SimpleFSA<CREATE_COMMENT_START, CommentInitFields>;
export const createCommentStart: (payload: CommentInitFields) => CreateCommentStart =
    payload => ({
        type: CREATE_COMMENT_START,
        payload,
    });


type CreateCommentSuccess = SimpleFSA<CREATE_COMMENT_SUCCESS, Comment>;
export const createCommentSuccess: (comment: Comment) => CreateCommentSuccess =
    comment => ({
        type: CREATE_COMMENT_SUCCESS,
        payload: comment,
    });

/* Edit comment */

type CommentEditFields = Pick<Comment, "id"|"body">;
type EditCommentStart = SimpleFSA<EDIT_COMMENT_START, CommentEditFields>;
export const editCommentStart: (payload: CommentEditFields) => EditCommentStart =
    payload => ({
        type: EDIT_COMMENT_START,
        payload,
    });

type EditCommentSuccess = SimpleFSA<EDIT_COMMENT_SUCCESS, Comment>;
export const editCommentSuccess: (comment: Comment) => EditCommentSuccess =
    comment => ({
        type: EDIT_COMMENT_SUCCESS,
        payload: comment,
    });

/* Delete comment */

type CommentDeleteFields = Pick<Comment, "id">;
type DeleteCommentStart = SimpleFSA<DELETE_COMMENT_START, CommentDeleteFields>;
export const deleteCommentStart: (payload: Pick<Comment, "id">) => DeleteCommentStart =
    payload => ({
        type: DELETE_COMMENT_START,
        payload,
    });

type DeleteCommentSuccess = SimpleFSA<DELETE_COMMENT_SUCCESS, Comment>;
export const deleteCommentSuccess: (comment: Comment) => DeleteCommentSuccess =
    comment => ({
        type: DELETE_COMMENT_SUCCESS,
        payload: comment,
    });


/* Vote on post or comment */

interface Vote {
    id: Post["id"]|Comment["id"];
    entityType: "post" | "comment";
    vote: "up" | "down";
}

type VoteStart = SimpleFSA<VOTE_START, Vote>;
export const voteStart: (payload: Vote) => VoteStart =
    payload => ({
        type: VOTE_START,
        payload,
    });

type VoteSuccess<T extends Post|Comment> = SimpleFSA<VOTE_SUCCESS, T>;
function voteSuccess(payload: Post): VoteSuccess<Post>;
function voteSuccess(payload: Comment): VoteSuccess<Comment>;
function voteSuccess(payload: any) {
    return {
        type: VOTE_SUCCESS,
        payload,
    };
}

// -----------------------------------------------------------------------------
//  Asynchronous action types and action creators
// -----------------------------------------------------------------------------

export type AsyncAppAction<R extends ResultActionTypes> = thunk.ThunkAction<
    Promise<R>,
    ApplicationState,
    {}
>;

/* Posts */

type LoadPostsAsync = AsyncAppAction<LoadPostsSuccess>;
export const loadPostsAsync: () => LoadPostsAsync =
    () => async (dispatch, getState) => {
        dispatch(loadPostsStart());
        const posts = await api.allPosts();
        return dispatch(loadPostsSuccess(posts));
    };

type CreatePostAsync = AsyncAppAction<CreatePostSuccess>;
export const createPostAsync: (
    details: Pick<PostInitFields, "title"|"body"|"author"|"category">
) => CreatePostAsync =
    details => async (dispatch, getState) => {

        const id = uuid4();
        const timestamp = Date.now();
        const postInit = {...details, id, timestamp};

        dispatch(createPostStart(postInit));
        const post = await api.publishPost(postInit);
        return dispatch(createPostSuccess(post));
    };

type EditPostAsync = AsyncAppAction<EditPostSuccess>;
export const editPostAsync: (details: PostEditFields) => EditPostAsync =
    details => async (dispatch, getState) => {

        dispatch(editPostStart(details));
        const post = await api.editPost(details);
        return dispatch(editPostSuccess(post));

    };

type DeletePostAsync = AsyncAppAction<DeletePostSuccess>;
export const deletePostAsync: (details: Pick<Post, "id">) => DeletePostAsync =
    details => async (dispatch, getState) => {

        dispatch(deletePostStart(details));
        const post = await api.deletePost(details);
        return dispatch(deletePostSuccess(post));

    };


/* Comments */

type LoadCommentsAsync = AsyncAppAction<LoadCommentsSuccess>;
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

type CreateCommentAsync = AsyncAppAction<CreateCommentSuccess>;
export const createCommentAsync: (
    details: Pick<CommentInitFields, "body"|"author"|"parentId">
) => CreateCommentAsync =
    details => async (dispatch, getState) => {

        const id = uuid4();
        const timestamp = Date.now();
        const commentInit = {...details, id, timestamp};

        dispatch(createCommentStart(commentInit));
        const comment = await api.publishComment(commentInit);
        return dispatch(createCommentSuccess(comment));
    };

type EditCommentAsync = AsyncAppAction<EditCommentSuccess>;
export const editCommentAsync: (
    details: Pick<CommentEditFields, "id"|"body">
) => EditCommentAsync =
    details => async (dispatch, getState) => {

        dispatch(editCommentStart(details));
        const comment = await api.editComment(details);
        return dispatch(editCommentSuccess(comment));

    };

type DeleteCommentAsync = AsyncAppAction<DeleteCommentSuccess>;
export const deleteCommentAsync: (details: Pick<Comment, "id">) => DeleteCommentAsync =
    details => async (dispatch, getState) => {

        dispatch(deleteCommentStart(details));
        const comment = await api.deleteComment(details);
        return dispatch(deleteCommentSuccess(comment));

    };

/* Both posts and comments */

export function voteAsync(vote: Vote & { entityType: "post"}): AsyncAppAction<VoteSuccess<Post>>;
export function voteAsync(vote: Vote & { entityType: "comment"}): AsyncAppAction<VoteSuccess<Comment>>;
export function voteAsync(vote: any): any {
    return async (
        dispatch: redux.Dispatch<ApplicationState>,
        getState: () => ApplicationState,
    ) => {

        dispatch(voteStart(vote));
        const entity = await api.castVote(vote);
        return dispatch(voteSuccess(entity));

    };
}
