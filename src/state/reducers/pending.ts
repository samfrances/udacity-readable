/* Queue for pending async actions */

import { ActionTypes } from "../actions";
import { RequestAction, hasRequestMeta } from "../helpers";

export type PendingState = Array<ActionTypes & RequestAction>;

export const getInitialState = (): PendingState => [];

export default function pending(
    state: PendingState = getInitialState(),
    action: ActionTypes,
) {
    if (action.type.endsWith("_START")) {
        return [...state, action];
    }
    // remove pending actions from the queue when a corresponding success
    // action is received
    if (
        (action.type.endsWith("_SUCCESS") || action.type.endsWith("_FAILURE"))
        && hasRequestMeta(action)
    ) {
        return state.filter(
            pendingAction =>
                pendingAction.meta.request.id !== action.meta.request.id
        );
    }
    return state;
}
