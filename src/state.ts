/* State types */

import { Post, Comment } from "./interfaces";

interface EntityIndex<T> {
    byId: {
        [id: string]: T;
    };
    allIds: string[];
}

export interface ApplicationState {
    entities: {
        posts: EntityIndex<Post>;
        comments: EntityIndex<Comment>;
    };
}

/* Reducers */



/* Initial state */

const initialState: ApplicationState = {
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

