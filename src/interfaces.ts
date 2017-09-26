/* Common "domain" interfaces */

export type Category = "react" | "redux" | "udacity";

export type Uuid = string;

interface Common {
    id: Uuid;
    timestamp: number;
    voteScore: number;
    deleted: boolean;
    body: string;
    author: string;
}

export interface Post extends Common {
    title: string;
    category: Category;
}

export interface Comment extends Common {
    parentId: Uuid;
    parentDeleted: boolean;
}
