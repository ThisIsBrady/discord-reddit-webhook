import fetch from 'node-fetch';

type Post = {
    data: {
        /** Post title */
        title: string;
        /** Post Identifier */
        id: string;
        /** Permanent link to post. Excludes reddit.com domain */
        permalink: string;
        /** Subreddit in form of 'r/subredditname' */
        subreddit_name_prefixed: string;
        /** Text of post */
        selftext: string;
        /** HTML-escaped text of post */
        selftext_html: string;
        /** Pretty-name of author. Excludes u/ */
        author: string;
        /** URL to thumbnail of post */
        thumbnail: string;
        /** UTC Timestamp of post */
        created_utc: number;
    };
};

type RedditResponse = {
    kind: 'Listing';
    data: {
        children: Post[];
    };
};

async function getPosts(sub: string): Promise<RedditResponse> {
    try {
        const response = await fetch(`https://reddit.com/${sub}/new/.json`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching reddit posts! Status: ${response.status}`);
        }

        const result = (await response.json()) as RedditResponse;
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error Message: ${error.message}`);
            return Promise.reject(error.message);
        } else {
            console.error(`Unexpected Error: ${error}`);
            return Promise.reject(error);
        }
    }
}

export { getPosts, RedditResponse, Post };
