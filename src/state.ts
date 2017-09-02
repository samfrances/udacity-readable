/* State types */

import { Post, Comment } from "./interfaces";

export interface IEntityIndex<T> {
    byId: {
        [id: string]: T;
    };
    allIds: string[];
}

export interface IApplicationState {
    entities: {
        posts: IEntityIndex<Post>;
        comments: IEntityIndex<Comment>;
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

