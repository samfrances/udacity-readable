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
    owner: string;
    category: Category;
}

export interface CommentCore {
    body: string;
    owner: string;
    parentId: Uuid;
    parentDeleted: boolean;
}

export interface Post extends PostCore, CommonBase {}

export interface Comment extends CommentCore, CommonBase {}
