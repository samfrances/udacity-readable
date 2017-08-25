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

export interface IEntityIndex<T> {
    byId: {
        [id: string]: T;
    };
    allIds: string[];
}

export interface IApplicationState {
    entities: {
        posts: IEntityIndex<IPost>;
        comments: IEntityIndex<IComment>;
    };
}

/* Reducers */



/* Initial state */

const initialState: IApplicationState = {
    entities: {
        posts: {
            byId: {},
            allIds: []
        },
        comments: {
            byId: {},
            allIds: []
        }
    }
}
