import "core-js";
import "isomorphic-fetch";
import * as redux from "redux";

import * as actions from "./state/actions";
import * as state from "./state";
import * as api from "./utils/api";
// import './scratchpads/thunk1';

import "file-loader?name=[name].[ext]!./index.html";

const store = state.storeFactory();

// Load posts and comments from server
store
.dispatch(actions.loadPostsAsync())
.then(() => store.dispatch(actions.loadCommentsAsync()));

export default { api, state, store, actions };
