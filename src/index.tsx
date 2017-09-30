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

(async () => {

    await store.dispatch(actions.loadPostsAsync());

    await store.dispatch(actions.loadCommentsAsync());

    const resAction = await store.dispatch(
        actions.createPostAsync({
            title: "my post",
            body: "blah",
            author: "me",
            category: "udacity",
        })
    );

    const parentId = resAction.payload.id;

    await store.dispatch(
        actions.createCommentAsync({
            body: "Hello, I have a comment to make",
            author: "Commenter one",
            parentId,
        })
    );

    await store.dispatch(
        actions.editPostAsync({
            id: parentId,
            body: "my post has been edited",
            title: "my post",
        })
    );

})();

export default { api, state, store, actions };
