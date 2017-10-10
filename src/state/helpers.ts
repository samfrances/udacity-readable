import * as redux from "redux";

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
     */
    function thunkCreatorFactory<D, P extends A, R extends A>(
        pending: (details: D) => P,
        request: (payload: P["payload"]) => Promise<R["payload"]>,
        resolved: (payload: R["payload"]) => R,
    ): ThunkCreator<D, A, Promise<R>, S, {}> {
        return (details: D) => async dispatch => {

            const action = pending(details);

            const payload = action.payload;

            dispatch(action);

            const res = await request(payload);

            return dispatch(resolved(res));
        };
    }

    return thunkCreatorFactory;

}
