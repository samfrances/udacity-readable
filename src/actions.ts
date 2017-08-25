import uuid4 from 'uuid/v4';

import { IPost, Category } from './state';

interface ICreatePostAction {
    type: "CREATE_POST";
    payload: IPost;
}
interface ICreatePostParams {
    title: string,
    body: string,
    author: string,
    category: Category
}
export const createPost = (args: ICreatePostParams): ICreatePostAction => ({
    type: "CREATE_POST",
    payload: {
        ...args,
        timestamp: Date.now(),
        voteScore: 1,
        deleted: false,
        id: uuid4()
    }
});
