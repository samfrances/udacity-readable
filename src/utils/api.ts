const api = process.env.READABLE_APP_API_URL || 'http://localhost:5001'

export async function getPosts() {
    return await (await fetch(
        `${api}/posts`,
        { headers: { 'Authorization': 'whatever-you-want' }}
    )).json();
}