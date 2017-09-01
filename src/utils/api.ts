import * as uuid4 from "uuid/v4";
import { PostCore, Post, CommentCore, Comment, Uuid, Category } from "../interfaces";

const api = process.env.READABLE_APP_API_URL || 'http://localhost:5001'

const headers = {
    'Authorization': 'whatever-you-want',
    'Accept': 'application/json',
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
    )).json()
}

export async function commentsById(id: Uuid) {
    return await (await fetch(
        `${api}/comments/${id}`,
        { headers }
    )).json()
}

/* POST functions */

const postHeaders = {...headers, 'Content-Type': 'application/json'}

export async function publishPost(details: PostCore): Promise<Post> {

    const postBody = {
        ...details,
        id: uuid4(),
        timestamp: Date.now(),
    };

    const res = await fetch(
        `${api}/posts`,
        {
            method: "post",
            body: JSON.stringify(postBody),
            headers: postHeaders
        }
    );

    const data: Post =  await res.json();

    return data

}

export async function vote(
            {
                id,
                entityType,
                vote
            }: {
                id: Uuid,
                entityType: "post" | "comment",
                vote: "up" | "down"
            }
        ): Promise<number> {

    const res = await fetch(
        `${api}/${entityType}s/${id}`,
        {
            method: "post",
            body: JSON.stringify({ option: `${vote}Vote` }),
            headers: postHeaders
        }
    )

    const { voteScore }: Post  = await res.json()

    return voteScore;

}

