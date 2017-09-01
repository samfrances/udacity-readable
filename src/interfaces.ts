/* Common "domain" interfaces */

export type Category = "react" | "redux" | "udacity";

export type Uuid = string;

interface CommonBase {
    id: Uuid;
    timestamp: number;
    voteScore: number;
    deleted: Boolean;
}

export interface PostCore {
    title: string;
    body: string;
    author: string;
    category: Category;
}

export interface CommentCore {
    body: string;
    author: string;
    parentId: Uuid;
    parentDeleted: boolean;
}

export interface Post extends PostCore, CommonBase {}

export interface Comment extends CommentCore, CommonBase {}
