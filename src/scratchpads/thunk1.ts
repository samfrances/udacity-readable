/* Module for random experiments */

import * as redux from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';

interface MyState {
    name: string;
}

interface MyAction {
    type: "SET_NAME";
    name: string;
}

function myAction (name: string): MyAction {
    return {
        type: "SET_NAME",
        name
    };
}

function myActionAsync <E>(): MyThunkAction<E> {
    return async dispatch => {
        const result = await fetch("https://randomuser.me/api/", {mode: "cors"});
        const json = await result.json();
        const name = json.results[0].name + " " + json.results[0].name;
        return myAction(name);
    }
}

type MyThunkAction<E> = ThunkAction<Promise<MyAction>, MyState, E>

interface MyStore {
    dispatch(action: MyAction): MyAction;
    dispatch<E>(action: MyThunkAction<E>): Promise<MyAction>;
    getState(): MyState;
    subscribe(listener: () => void): redux.Unsubscribe;
    replaceReducer(nextReducer: redux.Reducer<MyState>): void;
};

function myReducer(state: MyState, action: MyAction): MyState {
    switch (action.type) {
        case "SET_NAME":
            return { name: action.name };

        default:
            return state;
    }
}

const initialState: MyState = {
    name: ""
}

function storeFactory (): MyStore {
    return redux.createStore(
        myReducer,
        initialState,
        redux.applyMiddleware(thunk)
    );
}

const store = storeFactory();

console.log(store.getState());
store.dispatch(myAction("Bob Smith"));
console.log(store.getState());

store.dispatch(myActionAsync())
.then(action => console.log(action));

store.dispatch({type: "SET_NAME", name: "Bob"})
