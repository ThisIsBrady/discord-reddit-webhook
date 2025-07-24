import { Hooks } from '../src/db.js';
import { RedditResponse, getPosts } from '../src/reddit.js';

async function addWebhook(sub: string, hook: string) {
    if (!sub || !hook) {
        console.error('Usage: yarn addHook [r/subreddit] [webhook_link]');
        process.exit(1);
    }

    console.log(`Adding Sub ${sub} to hook ${hook}`);
    let maxTime: number = 0;

    // matches strings starting with 'r/', followed by 2-21 letters, numbers, or underscores.
    const subredditRegex = /^r\/[A-Za-z0-9_]{2,21}$/;
    if (!subredditRegex.test(sub)) {
        console.error('Invalid Subreddit');
        process.exit(1);
    } else {
        console.log('Verifying Subreddit');
        await getPosts(sub)
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
        }).catch((error) => {
            console.error('Failed to fetch from webhook URL', error);
            process.exit(1);
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
            }).catch((error) => {
                console.error('Failed to create webhook entry in database', error);
                process.exit(1);
            });
        }
    } else {
        console.error('Invalid Discord Webhook');
        process.exit(1);
    }
}

const sub = process.argv[2];
const hook = process.argv[3];
addWebhook(sub, hook);
