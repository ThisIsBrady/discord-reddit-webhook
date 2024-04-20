import { Hooks } from '../src/db.js';
import { RedditResponse, getPosts } from '../src/reddit.js';

const sub = process.argv[2];
const hook = process.argv[3];

console.log(`Adding Sub ${sub} to hook ${hook}`);
let maxTime: number = 0;

if (!sub.startsWith('r/') && sub.length < 3) {
    console.error('Invalid Subreddit');
} else {
    console.log('Verifying Subreddit');
    getPosts(sub)
        .then((response: RedditResponse) => {
            response.data.children.forEach((post) => {
                if (post.data.created_utc > maxTime) {
                    maxTime = post.data.created_utc;
                }
            });
        })
        .catch((error) => {
            console.error('Failed to fetch subreddit posts', error);
            process.exit(1);
        });
}
console.log('Verified Subreddit, Verifying Webhook');

if (hook.startsWith('https://discord.com/api/webhooks/')) {
    const res = await fetch(hook, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        console.error('Invalid discord webook');
        process.exit(1);
    } else {
        console.log('Validated Webhook URL, Adding Webhook');
        await Hooks.create({
            sub: sub,
            hook: hook,
            lastPostTimestamp: maxTime,
        });
    }
} else {
    console.error('Invalid Discord Webhook');
    process.exit(1);
}
