import uuid4 from "uuid/v4";

import { IPost, IComment, Category } from "./state";

/* Generic interfaces */

interface IFluxAction<T extends string, P> {
    type: T;
    payload: P;
}

/* Post actions */

type ICreatePostAction = IFluxAction<"CREATE_POST", IPost>;
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

type IEditPostAction = IFluxAction<"EDIT_POST", IEditPostParams>;
interface IEditPostParams extends ICreatePostParams { id: string; }
export const editPost = (args: IEditPostParams): IEditPostAction => ({
    type: "EDIT_POST",
    payload: {...args},
});

/* Comment actions */

interface ICommentParamsCommon {
    body: string;
    author: string;
}

type ICreateCommentAction = IFluxAction<"CREATE_COMMENT", IComment>;
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

type IEditCommentAction = IFluxAction<"EDIT_COMMENT", IEditCommentParams>;
interface IEditCommentParams extends ICommentParamsCommon { id: string; }
export const editComment = (args: IEditCommentParams): IEditCommentAction => ({
    type: "EDIT_COMMENT",
    payload: {...args},
});

/* Actions for both posts and comments */

interface ISimpleActionParams { id: string; }
interface ISimpleAction<T extends string> extends IFluxAction<T, ISimpleActionParams> {}

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
