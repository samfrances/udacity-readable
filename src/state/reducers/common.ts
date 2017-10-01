/** Shared resources and utils for reducers */

export interface EntityIndex<T> {
    byId: {
        [id: string]: T;
    };
    allIds: string[];
}

export const getEmptyIndex: <E>() => EntityIndex<E> =
    () => ({
        byId: {},
        allIds: [],
    });
