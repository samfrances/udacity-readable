import { Post, Comment, Uuid, Category } from "../interfaces";

const api = process.env.READABLE_APP_API_URL;

const headers = {
    Authorization: "whatever-you-want",
    Accept: "application/json",
};

/* GET functions */

export async function allCategories() {
    return await (await fetch(
        `${api}/categories`,
        { headers }
    )).json();
}

export async function postsByCategory(category: Category) {
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

export async function postById(id: Uuid) {
    return await (await fetch(
        `${api}/posts/${id}/`,
        { headers }
    )).json();
}

export async function commentsByPostId(id: Uuid) {
    return await (await fetch(
        `${api}/posts/${id}/comments`,
        { headers }
    )).json();
}

export async function commentsById(id: Uuid) {
    return await (await fetch(
        `${api}/comments/${id}`,
        { headers }
    )).json();
}

/* POST functions */

const postHeaders = {...headers, "Content-Type": "application/json"};


export async function publishPost(
    details: Pick<Post, "id"|"timestamp"|"title"|"body"|"author"|"category">
): Promise<Post> {

    const res = await fetch(
        `${api}/posts`,
        {
            method: "post",
            body: JSON.stringify(details),
            headers: postHeaders,
        }
    );

    const data: Post =  await res.json();

    return data;
}

export async function publishComment(
    details: Pick<Comment, "id"|"timestamp"|"body"|"author"|"parentId">
): Promise<Comment> {

    const res = await fetch(
        `${api}/comments`,
        {
            method: "post",
            body: JSON.stringify(details),
            headers: postHeaders,
        }
    );

    const data: Comment =  await res.json();

    return data;
}

interface Vote {
    id: Uuid;
    entityType: "post"|"comment";
    vote: "up" | "down";
}
export function castVote(vote: Vote & { entityType: "post" }): Promise<Post>;
export function castVote(vote: Vote & { entityType: "comment"}): Promise<Comment>;
export async function castVote({id, entityType, vote}: any) {

    const res = await fetch(
        `${api}/${entityType}s/${id}`,
        {
            method: "post",
            body: JSON.stringify({ option: `${vote}Vote` }),
            headers: postHeaders,
        }
    );

    const data: Post|Comment = await res.json();

    function isPost(entity: Post|Comment): entity is Post {
        return Object.keys(entity).includes("title");
    }

    return data;

}

/* DELETE functions */

export async function deletePost(id: Uuid): Promise<Post> {

    const res = await fetch(`${api}/posts/${id}`, { method: "delete", headers });

    return await res.json();
}

export async function deleteComment(id: Uuid): Promise<Comment> {

    const res = await fetch(`${api}/comments/${id}`, { method: "delete", headers });

    return await res.json();
}

/* PUT functions */

export async function editPost(
    args: Pick<Post, "id"|"title"|"body">
): Promise<Post> {

    const { id, title, body } = args;

    const res = await fetch(
        `${api}/posts/${id}`,
        {
            method: "PUT",
            headers: postHeaders,
            body: JSON.stringify({ title, body }),
        }
    );

    return await res.json();

}

export async function editComment(
    args: Pick<Comment, "id"|"body">
): Promise<Comment> {

    const { id, body } = args;

    const res = await fetch(
        `${api}/comments/${id}`,
        {
            method: "PUT",
            headers: postHeaders,
            body: JSON.stringify({
                timestamp: Date.now(),
                body,
            }),
        }
    );

    return await res.json();
}
