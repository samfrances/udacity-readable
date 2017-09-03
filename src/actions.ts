import * as uuid4 from "uuid/v4";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import { IApplicationState } from "./state";

/* Constants */

export type ActionTypesSync = ICreatePostAction | IEditPostParams | ICreateCommentAction
    | IEditCommentAction | IDeleteAction | IUpVoteAction | IDownVoteAction;

export type ActionTypesAsync<E> =
    ThunkAction<Promise<ActionTypesSync>, IApplicationState, E>;


/* Generic interfaces */

interface FluxAction<T extends string, P> {
    type: T;
    payload: P;
    error?: boolean;
    meta?: Object
}

const simpleActionCreator: <T extends string, P>(type: T) => (payload: P) => FluxAction<T, P> =
    type => payload => ({
        type,
        payload,
    });

interface IAsyncActionCreator<P, S, R> {
    <E>(args: P) : ThunkAction<Promise<R>, S, E>;
}

/* Post actions */

type ICreatePostAction = FluxAction<"CREATE_POST", IPost>;
interface ICreatePostParams {
    title: string;
    body: string;
    author: string;
    category: Category;
}
export const createPost = (args: ICreatePostParams): ICreatePostAction => ({
    type: "CREATE_POST",
    payload: {
        ...args,
        timestamp: Date.now(),
        voteScore: 1,
        deleted: false,
        id: `post-${uuid4()}`,
    },
});

type ICreatePostAsync = IAsyncActionCreator<ICreatePostParams,
                                            IApplicationState,
                                            ICreatePostAction>;
export const createPostAsync: ICreatePostAsync =
    args => async dispatch => {
        await fetch("http:/localhost:5001/post", {method: "POST"});
        return createPost(args);
    };

type IEditPostAction = FluxAction<"EDIT_POST", IEditPostParams>;
interface IEditPostParams extends ICreatePostParams { id: string; }

export const editPost = simpleActionCreator<"EDIT_POST", IEditPostParams>("EDIT_POST");
const a1: IEditPostAction = editPost({ body: "hello", id: "h", title: "helo", author: "bob", category: "udacity" })
console.log(a1)

// export const editPost = (args: IEditPostParams): IEditPostAction => ({
//     type: "EDIT_POST",
//     payload: {...args},
// });

/* Comment actions */

interface ICommentParamsCommon {
    body: string;
    author: string;
}

type ICreateCommentAction = FluxAction<"CREATE_COMMENT", IComment>;
interface ICreateCommentParams extends ICommentParamsCommon {
    parentId: string;
}
export const createComment = (args: ICreateCommentParams): ICreateCommentAction => ({
    type: "CREATE_COMMENT",
    payload: {
        ...args,
        parentDeleted: false,
        id: `comment-${uuid4()}`,
        timestamp: Date.now(),
        voteScore: 1,
        deleted: false,
    },
});

type IEditCommentAction = FluxAction<"EDIT_COMMENT", IEditCommentParams>;
interface IEditCommentParams extends ICommentParamsCommon { id: string; }
export const editComment = (args: IEditCommentParams): IEditCommentAction => ({
    type: "EDIT_COMMENT",
    payload: {...args},
});

/* Actions for both posts and comments */

interface ISimpleActionParams { id: string; }
interface ISimpleAction<T extends string> extends FluxAction<T, ISimpleActionParams> {}

type IDeleteAction = ISimpleAction<"DELETE">;
export const deleteIt = (args: ISimpleActionParams): IDeleteAction => ({
    type: "DELETE",
    payload: {...args},
});

type IUpVoteAction = ISimpleAction<"UPVOTE">;
export const upVote = (args: ISimpleActionParams): IUpVoteAction => ({
    type: "UPVOTE",
    payload: {...args},
});

type IDownVoteAction = ISimpleAction<"DOWNVOTE">;
export const downVote = (args: ISimpleActionParams): IDownVoteAction => ({
    type: "DOWNVOTE",
    payload: {...args},
});
