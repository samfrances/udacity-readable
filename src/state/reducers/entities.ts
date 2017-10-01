import * as redux from "redux";

import posts, * as fromPosts from "./posts";
import comments, * as fromComments from "./comments";


export interface EntitiesState {
    posts: fromPosts.PostsState;
    comments: fromComments.CommentsState;
}

export const getInitialState: () => EntitiesState =
    () => ({
        posts: fromPosts.getInitialState(),
        comments: fromComments.getInitialState(),
    });

const entities = redux.combineReducers<EntitiesState>({ posts, comments });

export default entities;
