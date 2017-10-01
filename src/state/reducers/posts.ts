import { EntityIndex, getEmptyIndex } from "./common";
import { Post, isPost } from "../../interfaces";
import { ActionTypesSynch } from "../actions";
import {
    LOAD_POSTS_SUCCESS, CREATE_POST_SUCCESS, EDIT_POST_SUCCESS, DELETE_POST_SUCCESS,
    VOTE_SUCCESS,
} from "../actions/constants";

export type PostsState = EntityIndex<Post>;

export const getInitialState = () => getEmptyIndex<Post>();

export default function posts(
    state: PostsState = getInitialState(),
    action: ActionTypesSynch,
): PostsState {
    switch (action.type) {

        case LOAD_POSTS_SUCCESS:
            return {
                byId: Object.assign({},
                    ...action.payload.posts.map( post => ({ [post.id]: post }) )
                ),
                allIds: action.payload.posts.map(post => post.id),
            };

        case CREATE_POST_SUCCESS:
            return {
                byId: {
                    ...state.byId,
                    [action.payload.id]: action.payload,
                },
                allIds: [
                    ...state.allIds,
                    action.payload.id,
                ],
            };

        case EDIT_POST_SUCCESS:
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.payload.id]: action.payload,
                },
            };

        case DELETE_POST_SUCCESS:
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.payload.id]: action.payload,
                },
            };

        case VOTE_SUCCESS:

            return (
                isPost(action.payload)
                    ? {
                        ...state,
                        byId: {
                            ...state.byId,
                            [action.payload.id]: action.payload,
                        },
                    }
                    : state
            );

        default:
            return state;
    }
}
