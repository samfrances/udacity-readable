import * as redux from "redux";

import entities, * as fromEntities from "./entities";
import pending, * as fromPending from "./pending";

export interface ApplicationState {
    entities: fromEntities.EntitiesState;
    pending: fromPending.PendingState;
}

export const getInitialState: () => ApplicationState =
    () => ({
        entities: fromEntities.getInitialState(),
        pending: fromPending.getInitialState(),
    });

const reducer = redux.combineReducers<ApplicationState>({ entities, pending });

export default reducer;
