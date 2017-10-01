import * as redux from "redux";

import entities, * as fromEntities from "./entities";

export interface ApplicationState {
    entities: fromEntities.EntitiesState;
}

export const getInitialState: () => ApplicationState =
    () => ({
        entities: fromEntities.getInitialState(),
    });

const reducer = redux.combineReducers<ApplicationState>({ entities });

export default reducer;
