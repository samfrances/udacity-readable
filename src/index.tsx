import "core-js";
import * as redux from 'redux';

import * as actions from "./actions";
import * as state from "./state";
import * as server_api from './utils/api';
import './scratchpads/thunk1';

import "file-loader?name=[name].[ext]!./index.html";

export const api = server_api;