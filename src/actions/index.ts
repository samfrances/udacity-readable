import * as uuid4 from "uuid/v4";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import { ApplicationState } from "../state";

import { Post, Comment, Category } from "../interfaces"

/* Constants */

export type SynchActionTypes =
    | LoadPostsStart
    | LoadPostsSuccess
    | LoadCommentsStart
    | LoadCommentsSuccess;

type LOAD_POSTS_START = "LOAD_POSTS_START";
const LOAD_POSTS_START = "LOAD_POSTS_START";

type LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";

type LOAD_COMMENTS_START = "LOAD_COMMENTS_START";
const LOAD_COMMENTS_START = "LOAD_COMMENTS_START";

type LOAD_COMMENTS_SUCCESS = "LOAD_COMMENTS_SUCCESS";
const LOAD_COMMENTS_SUCCESS = "LOAD_COMMENTS_SUCCESS";

/* Generic interfaces */

interface FluxAction<T extends string, P> {
    type: T;
    payload?: P;
    error?: boolean;
    meta?: Object
}

/* Synchronous action types */

export type LoadPostsStart = FluxAction<LOAD_POSTS_START, undefined>;

export type LoadPostsSuccess = FluxAction<LOAD_POSTS_SUCCESS, Post[]>;

export type LoadCommentsStart = FluxAction<LOAD_COMMENTS_START, undefined>;

export type LoadCommentsSuccess = FluxAction<LOAD_COMMENTS_SUCCESS, Comment[]>;


/* Helpers and factories */

const simpleActionCreator: <T extends string, P>(type: T) => (payload: P) => FluxAction<T, P> =
    type => payload => ({
        type,
        payload,
    });

/* Synchronous action creators */

export const loadPostsStart =
    simpleActionCreator<LOAD_POSTS_START, undefined>(LOAD_POSTS_START);

export const loadPostsSuccess =
    simpleActionCreator<LOAD_POSTS_SUCCESS, Post[]>(LOAD_POSTS_SUCCESS);

export const loadCommentsStart =
    simpleActionCreator<LOAD_COMMENTS_START, undefined>(LOAD_COMMENTS_START);

export const loadCommentsSuccess =
    simpleActionCreator<LOAD_COMMENTS_SUCCESS, undefined>(LOAD_COMMENTS_SUCCESS);

/* Asynchronous action types */

export type LoadPostsAsync<E> = ThunkAction<
    Promise<LoadPostsSuccess>,
    ApplicationState,
    E
>;

export type LoadCommentsAsync<E> = ThunkAction<
    Promise<LoadCommentsSuccess>,
    ApplicationState,
    E
>;
