import { EntityIndex, getEmptyIndex } from "./common";
import { Comment, Post } from "../../interfaces";
import { ActionTypesSynch } from "../actions";
import {
    LOAD_COMMENTS_SUCCESS, CREATE_COMMENT_SUCCESS, EDIT_COMMENT_SUCCESS,
    DELETE_POST_SUCCESS,
} from "../actions/constants";

export type CommentsState = EntityIndex<Comment>;

export const getInitialState = () => getEmptyIndex<Comment>();

export default function comments(
    state: CommentsState = getInitialState(),
    action: ActionTypesSynch,
): CommentsState {

    switch (action.type) {

        case LOAD_COMMENTS_SUCCESS:
            return {
                byId: Object.assign({},
                    ...action.payload.comments.map(
                        comment => ({ [comment.id]: comment })
                    )
                ),
                allIds: action.payload.comments.map(post => post.id),
            };

        case CREATE_COMMENT_SUCCESS:
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

        case EDIT_COMMENT_SUCCESS:
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.payload.id]: action.payload,
                },
            };

        case DELETE_POST_SUCCESS:

            const orphanCommentsUpdated =
                getCommentsByPostId(state, action.payload.id)
                .map<Comment>(comment => ({ ...comment, parentDeleted: true }));

            const updatedOrphansById: { [id: string]: Comment } =
                Object.assign({},
                    ...(
                        orphanCommentsUpdated
                        .map(comment => ({
                            [comment.id]: comment,
                        }))
                    )
                );

            return {
                ...state,
                byId: {
                    ...state.byId,
                    ...updatedOrphansById,
                },
            };

        default:
            return state;

    }

}

export const getCommentsByPostId: (state: CommentsState, id: Post["id"]) => Comment[] =
    (state, id) =>
        [...Object.values(state.byId)]
        .filter(comment => comment.parentId === id);
