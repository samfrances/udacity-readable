import "core-js";
import * as actions from './actions';

const act = actions.createPost({
    title: "title!",
    body: "body!",
    author: "Bob",
    category: "udacity"
});

console.log(act);

// import * as redux from 'redux';

// interface MyAction extends redux.Action {
//     type: "hello";
// }

// interface MyState {
//     counter: number;
// }

// interface MyStore extends redux.Store<MyState> {
//     dispatch<A extends MyAction>(action: A): A;
// }

// const reducer = function(state: MyState, action: MyAction) {
//     return {counter: state.counter + 1};
// }

// const store: MyStore = redux.createStore(reducer, {counter: 5});

// store.dispatch({ type: "hello" })
// console.log(store.getState())

