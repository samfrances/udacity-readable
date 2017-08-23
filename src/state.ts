/* State types */

export type Category = "react" | "redux" | "udacity";

export interface IUserGenerated {
    id: string;
    timestamp: number;
    body: string;
    author: string;
    voteScore: number;
    deleted: Boolean;
}

export interface IPost extends IUserGenerated {
    title: string;
    category: Category;
}

export interface IComment extends IUserGenerated {
    parentId: string;
    parentDeleted: boolean;
}

export interface IPostIndex {
    [postId: string]: IPost;
}

export interface ICommentIndex {
    [commentId: string]: IComment;
}

export interface IApplicationState {
    entities: {
        postsById: IPostIndex;
        commentsById: ICommentIndex;
    };
}
