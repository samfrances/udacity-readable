import * as redux from "redux";
import * as thunk from "redux-thunk";
import * as uuid4 from "uuid/v4";

import * as api from "../../utils/api";
import { ApplicationState } from "../reducers";
import { Post, Comment, Category } from "../../interfaces";
import {
    LOAD_POSTS_START, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE,
    LOAD_COMMENTS_START, LOAD_COMMENTS_SUCCESS, LOAD_COMMENTS_FAILURE,
    CREATE_POST_START, CREATE_POST_SUCCESS, CREATE_POST_FAILURE,
    CREATE_COMMENT_START, CREATE_COMMENT_SUCCESS, CREATE_COMMENT_FAILURE,
    EDIT_POST_START, EDIT_POST_SUCCESS, EDIT_POST_FAILURE,
    EDIT_COMMENT_START, EDIT_COMMENT_SUCCESS, EDIT_COMMENT_FAILURE,
    DELETE_POST_START, DELETE_POST_SUCCESS, DELETE_POST_FAILURE,
    DELETE_COMMENT_START, DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAILURE,
    VOTE_START, VOTE_SUCCESS, VOTE_FAILURE,
} from "./constants";

import {
    SimpleFSA,
    SimpleErrorFSA,
    simpleFSACreator,
    simpleErrorFSACreator,
    simpleFSACreatorWithTransform,
    makeThunkCreatorFactory,
    ActionTypedThunkAction,
    ActionTypedDispatch,
} from "../helpers";

/* Constants */

export type ActionTypes =
    | SimpleFSA<LOAD_POSTS_START, undefined>
    | SimpleFSA<LOAD_POSTS_SUCCESS, Post[]>
    | SimpleErrorFSA<LOAD_POSTS_FAILURE, undefined>
    | SimpleFSA<LOAD_COMMENTS_START, Post[]>
    | SimpleFSA<LOAD_COMMENTS_SUCCESS, Comment[]>
    | SimpleErrorFSA<LOAD_COMMENTS_FAILURE, Post[]>
    | SimpleFSA<CREATE_POST_START, PostInitFields>
    | SimpleFSA<CREATE_POST_SUCCESS, Post>
    | SimpleErrorFSA<CREATE_POST_FAILURE, Post>
    | SimpleFSA<CREATE_COMMENT_START, CommentInitFields>
    | SimpleFSA<CREATE_COMMENT_SUCCESS, Comment>
    | SimpleErrorFSA<CREATE_COMMENT_FAILURE, Comment>
    | SimpleFSA<EDIT_POST_START, PostEditFields>
    | SimpleFSA<EDIT_POST_SUCCESS, Post>
    | SimpleErrorFSA<EDIT_POST_FAILURE, Post>
    | SimpleFSA<EDIT_COMMENT_START, CommentEditFields>
    | SimpleFSA<EDIT_COMMENT_SUCCESS, Comment>
    | SimpleErrorFSA<EDIT_COMMENT_FAILURE, Comment>
    | SimpleFSA<DELETE_POST_START, PostDeleteFields>
    | SimpleFSA<DELETE_POST_SUCCESS, Post>
    | SimpleErrorFSA<DELETE_POST_FAILURE, Post>
    | SimpleFSA<DELETE_COMMENT_START, CommentDeleteFields>
    | SimpleFSA<DELETE_COMMENT_SUCCESS, Comment>
    | SimpleErrorFSA<DELETE_COMMENT_FAILURE, Comment>
    | SimpleFSA<VOTE_START, Vote>
    | VoteSuccess<Post>
    | VoteSuccess<Comment>
    | VoteFailure<Post>
    | VoteFailure<Comment>;

// -----------------------------------------------------------------------------
//  Synchronous actions, action types and action creators
// -----------------------------------------------------------------------------

/* Loading posts */

export const loadPostsStart =
    () => simpleFSACreator<LOAD_POSTS_START, undefined>(LOAD_POSTS_START)(undefined);

export const loadPostsSuccess =
    simpleFSACreator<LOAD_POSTS_SUCCESS, Post[]>(LOAD_POSTS_SUCCESS);

export const loadPostsFailure =
    () => simpleErrorFSACreator<LOAD_POSTS_FAILURE, undefined>(LOAD_POSTS_FAILURE)(undefined);

/* Creating new post */

type PostInitFields = Pick<Post, "id"|"timestamp"|"title"|"body"|"author"|"category">;
export const createPostStart =
    simpleFSACreatorWithTransform<
        CREATE_POST_START,
        Pick<PostInitFields, "title"|"body"|"author"|"category">,
        PostInitFields
    >(
        CREATE_POST_START,
        details => ({...details, id: uuid4(), timestamp: Date.now()})
    );

export const createPostSuccess =
    simpleFSACreator<CREATE_POST_SUCCESS, Post>(CREATE_POST_SUCCESS);

export const createPostFailure =
    simpleErrorFSACreator<CREATE_POST_FAILURE, Post>(CREATE_POST_FAILURE);

/* Edit post */

type PostEditFields = Pick<Post, "id"|"title"|"body">;
export const editPostStart =
    simpleFSACreator<EDIT_POST_START, PostEditFields>(EDIT_POST_START);

export const editPostSuccess =
    simpleFSACreator<EDIT_POST_START, Post>(EDIT_POST_START);

export const editPostFailure =
    simpleErrorFSACreator<EDIT_POST_FAILURE, Post>(EDIT_POST_FAILURE);

/* Delete post */

type PostDeleteFields = Pick<Post, "id">;
export const deletePostStart =
    simpleFSACreator<DELETE_POST_START, PostDeleteFields>(DELETE_POST_START);

export const deletePostSuccess =
    simpleFSACreator<DELETE_POST_SUCCESS, Post>(DELETE_POST_SUCCESS);

export const deletePostFailure =
    simpleErrorFSACreator<DELETE_POST_FAILURE, Post>(DELETE_POST_FAILURE);

/* Loading comments */

export const loadCommentsStart =
    simpleFSACreator<LOAD_COMMENTS_START, Post[]>(LOAD_COMMENTS_START);

export const loadCommentsSuccess =
    simpleFSACreator<LOAD_COMMENTS_SUCCESS, Comment[]>(LOAD_COMMENTS_SUCCESS);

export const loadCommentsFailure =
    simpleErrorFSACreator<LOAD_COMMENTS_FAILURE, Post[]>(LOAD_COMMENTS_FAILURE);

/* Create new comment */

type CommentInitFields = Pick<Comment, "id"|"timestamp"|"body"|"author"|"parentId">;
export const createCommentStart =
    simpleFSACreatorWithTransform<
        CREATE_COMMENT_START,
        Pick<CommentInitFields, "body"|"author"|"parentId">,
        CommentInitFields
    >(
        CREATE_COMMENT_START,
        details => ({...details, id: uuid4(), timestamp: Date.now()})
    );

export const createCommentSuccess =
    simpleFSACreator<CREATE_COMMENT_SUCCESS, Comment>(CREATE_COMMENT_SUCCESS);

export const createCommentFailure =
    simpleErrorFSACreator<CREATE_COMMENT_FAILURE, Comment>(CREATE_COMMENT_FAILURE);

/* Edit comment */

type CommentEditFields = Pick<Comment, "id"|"body">;
export const editCommentStart =
    simpleFSACreator<EDIT_COMMENT_START, CommentEditFields>(EDIT_COMMENT_START);

export const editCommentSuccess =
    simpleFSACreator<EDIT_COMMENT_SUCCESS, Comment>(EDIT_COMMENT_SUCCESS);

export const editCommentFailure =
    simpleErrorFSACreator<EDIT_COMMENT_FAILURE, Comment>(EDIT_COMMENT_FAILURE);

/* Delete comment */

type CommentDeleteFields = Pick<Comment, "id">;
export const deleteCommentStart =
    simpleFSACreator<DELETE_COMMENT_START, CommentDeleteFields>(DELETE_COMMENT_START);

export const deleteCommentSuccess =
    simpleFSACreator<DELETE_COMMENT_SUCCESS, Comment>(DELETE_COMMENT_SUCCESS);

export const deleteCommentFailure =
    simpleErrorFSACreator<DELETE_COMMENT_FAILURE, Comment>(DELETE_COMMENT_FAILURE);

/* Vote on post or comment */

interface Vote {
    id: Post["id"]|Comment["id"];
    entityType: "post" | "comment";
    vote: "up" | "down";
}

export const voteStart =
    simpleFSACreator<VOTE_START, Vote>(VOTE_START);

type VoteSuccess<T extends Post|Comment> = SimpleFSA<VOTE_SUCCESS, T>;
function voteSuccess(payload: Post): VoteSuccess<Post>;
function voteSuccess(payload: Comment): VoteSuccess<Comment>;
function voteSuccess(payload: any) {
    return {
        type: VOTE_SUCCESS,
        payload,
    };
}

type VoteFailure<T extends Post|Comment> = SimpleErrorFSA<VOTE_FAILURE, T>;
function voteFailure(payload: Post): VoteFailure<Post>;
function voteFailure(payload: Comment): VoteFailure<Comment>;
function voteFailure(payload: any) {
    return {
        type: VOTE_FAILURE,
        payload,
        error: true,
    };
}

// -----------------------------------------------------------------------------
//  Asynchronous action types and action creators
// -----------------------------------------------------------------------------

// Configure thunk creator factory
const thunkCreator = makeThunkCreatorFactory<ActionTypes, ApplicationState>();

type AsyncAppAction<R> = ActionTypedThunkAction<
    ActionTypes,
    Promise<R>,
    ApplicationState,
    {}
>;

/* Posts */

export const loadPostsAsync =
    () => thunkCreator(
        loadPostsStart,
        (arg: undefined) => api.allPosts(),
        loadPostsSuccess,
        loadPostsFailure,
    )({});

export const createPostAsync =
    thunkCreator(createPostStart, api.publishPost, createPostSuccess, createPostFailure);

export const editPostAsync =
    thunkCreator(editPostStart, api.editPost, editPostSuccess, editPostFailure);

export const deletePostAsync =
    thunkCreator(deletePostStart, api.deletePost, deletePostSuccess, deletePostFailure);


/* Comments */

type LoadCommentsThunk = AsyncAppAction<
    | SimpleFSA<LOAD_COMMENTS_SUCCESS, Comment[]>
    | SimpleFSA<LOAD_COMMENTS_FAILURE, Post[]>
>;
export const loadCommentsAsync: () => LoadCommentsThunk =
    () => async (dispatch, getState) => {
        const posts = Object.values(getState().entities.posts.byId);
        dispatch(loadCommentsStart(posts));

        try {

            const comments: Comment[] = await (async () => {
                const commentLists: Comment[][] = await Promise.all(
                    posts.map(post => api.commentsByPostId(post.id))
                );
                // flatten list of list of comments
                return ([] as Comment[]).concat(...commentLists);
            })();

            return dispatch(loadCommentsSuccess(comments));

        } catch (e) {

            return dispatch(loadCommentsFailure(posts));

        }

    };

export const createCommentAsync =
    thunkCreator(createCommentStart, api.publishComment, createCommentSuccess, createCommentFailure);

export const editCommentAsync =
    thunkCreator(editCommentStart, api.editComment, editCommentSuccess, editCommentFailure);

export const deleteCommentAsync =
    thunkCreator(deleteCommentStart, api.deleteComment, deleteCommentSuccess, deleteCommentFailure);

/* Both posts and comments */

export function voteAsync(vote: Vote & { entityType: "post"}): AsyncAppAction<VoteSuccess<Post>>;
export function voteAsync(vote: Vote & { entityType: "comment"}): AsyncAppAction<VoteSuccess<Comment>>;
export function voteAsync(vote: any): any {
    return async (dispatch: ActionTypedDispatch<ActionTypes>) => {

        dispatch(voteStart(vote));
        try {
            const entity = await api.castVote(vote);
            return dispatch(voteSuccess(entity));
        } catch (e) {
            return dispatch(voteFailure(vote));
        }
    };
}

