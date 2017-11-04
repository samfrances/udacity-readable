import * as redux from "redux";
import * as uuid4 from "uuid/v4";

// -----------------------------------------------------------------------------
//  Alternative interfaces for stronger typing of actions in the redux store
// -----------------------------------------------------------------------------

export interface ActionTypedDispatch<ACTION_TYPES> {
    <A extends ACTION_TYPES>(action: A): A;
}

export interface ActionTypedDispatch<ACTION_TYPES> {
    <R, S, E>(asyncAction: ActionTypedThunkAction<ACTION_TYPES, R, S, E>): R;
}

export type ActionTypedThunkAction<A, R, S, E> = (
    dispatch: ActionTypedDispatch<A>,
    getState: () => S,
    extraArgument: E
) => R;

export interface ActionTypedStore<ACTION_TYPES, STATE> {
    dispatch: ActionTypedDispatch<ACTION_TYPES>;
    getState(): STATE;
    subscribe(listener: () => void): redux.Unsubscribe;
    replaceReducer(nextReducer: redux.Reducer<STATE>): void;
}


// -----------------------------------------------------------------------------
//  Action interfaces
// -----------------------------------------------------------------------------

export interface SimpleFSA<T, P> {
    type: T;
    payload: P;
}

export interface SimpleErrorFSA<T, P> {
    type: T;
    payload: P;
    error: true;
}

// -----------------------------------------------------------------------------
//  Synchronous action helpers
// -----------------------------------------------------------------------------

export type SimpleFSACreator<T, D, P> =
    (detail: D) => SimpleFSA<T, P>;

export function simpleFSACreatorWithTransform<T, D, P>(
    type: T,
    transform: ((detail: D) => P)
): SimpleFSACreator<T, D, P> {

    return (detail: D) => ({
        type,
        payload: transform(detail),
    });

}

export function simpleFSACreator<T, P>(type: T) {
    return simpleFSACreatorWithTransform<T, P, P>(type, p => p);
}

export function simpleErrorFSACreator<T, P>(
    type: T
): (payload: P) => SimpleErrorFSA<T, P> {
    return (payload: P) => ({ type, payload, error: true });
}

// -----------------------------------------------------------------------------
//  Async action ("thunk") helpers
// -----------------------------------------------------------------------------

export interface RequestAction {
    meta: {
        request: {
            id: string;
        };
    };
}

export function withRequestMeta<A extends SimpleFSA<T, P>, T, P>(
    action: A, id: string
): A & RequestAction {

    const meta: RequestAction["meta"] = { request: { id }};

    return Object.assign(action, { meta });

}

export function hasRequestMeta<A>(action: A): action is A & RequestAction {
    return Object.keys(action).includes("meta");
}


/**
 * Interface for thunk creator
 *
 * @template D - input argument type to the thunk creator function
 * @template A - union of interfaces representing all acceptable synchronous redux actions
 * @template R - return type of the thunk
 * @template S - redux state tree interface
 * @template E - thunk extra argument type
 *
 */
export type ThunkCreator<D, A, R, S, E> =
    (details: D) => ActionTypedThunkAction<A, R, S, E>;

/**
 * Function which returns a factory function for creating ThunkCreator's
 *
 * @template A - union of interfaces representing all acceptable synchronous redux actions
 * @template S - redux state tree interface
 */
export function makeThunkCreatorFactory<A extends SimpleFSA<string, any>, S>() {

    /**
     * Factory function for creating thunk action creators
     *
     * @template D - input argument type to the thunk creator function
     * @template P - interface for the "pending" (or "start") action
     * @template R - interface for the "resolved" (or "success") action
     * @template F - interface for the failure action
     */
    function thunkCreatorFactory<D, P extends A, R extends A, F extends A>(
        pending: (details: D) => P,
        request: (payload: P["payload"]) => Promise<R["payload"]>,
        resolved: (payload: R["payload"]) => R,
        rejected: (payload: P["payload"]) => F,
    ): ThunkCreator<D, A, Promise<R|F>, S, {}> {
        return (details: D) => async dispatch => {

            const requestId = uuid4();

            const action = withRequestMeta(
                pending(details),
                requestId,
            );

            const payload = action.payload;

            dispatch(action);

            try {
                const res = await request(payload);
                return dispatch(
                    withRequestMeta(resolved(res), requestId)
                );
            } catch (e) {
                return dispatch(
                    withRequestMeta(rejected(payload), requestId)
                );
            }

        };
    }

    return thunkCreatorFactory;

}
