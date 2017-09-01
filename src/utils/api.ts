import * as uuid4 from "uuid/v4";

const api = process.env.READABLE_APP_API_URL || 'http://localhost:5001'

const headers = { 'Authorization': 'whatever-you-want' };

/* GET functions */

export async function allCategories() {
    return await (await fetch(
        `${api}/categories`,
        { headers }
    )).json();
}

export async function postsByCategory(category: string) {
    return await (await fetch(
        `${api}/${category}/posts`,
        { headers }
    )).json();
}

export async function allPosts() {
    return await (await fetch(
        `${api}/posts`,
        { headers }
    )).json();
}

export async function postById(id: string) {
    return await (await fetch(
        `${api}/posts/${id}/`,
        { headers }
    )).json();
}

export async function commentsByPostId(id: string) {
    return await (await fetch(
        `${api}/posts/${id}/comments`,
        { headers }
    )).json()
}

export async function commentsById(id: string) {
    return await (await fetch(
        `${api}/comments/${id}`,
        { headers }
    )).json()
}
