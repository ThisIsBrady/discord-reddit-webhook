import { Post, RedditResponse, getPosts } from './reddit.js';
import { Hooks } from './db.js';
import { EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

type QueuePost = {
    hook: string;
    body: string;
};

const postqueue: QueuePost[] = [];

async function doUpdate() {
    const entries = await Hooks.findAll();

    entries.forEach(async (entry) => {
        const posts: RedditResponse = await getPosts(entry.get('sub') as string);
        let maxTime = entry.get('lastPostTimestamp') as number;
        posts.data.children.forEach((post) => {
            if (post.data.created_utc > (entry.get('lastPostTimestamp') as number)) {
                const builder = new EmbedBuilder()
                    .setTitle(post.data.title)
                    .setURL(`https://reddit.com${post.data.permalink}`)
                    .setFooter({
                        text: `u/${post.data.author}`,
                        iconURL: 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png',
                    })
                    // Convert from seconds to ms before using
                    .setTimestamp(post.data.created_utc * 1000);

                if (post.data.selftext) {
                    if (post.data.selftext_html.length < 3500) {
                        builder.setDescription(post.data.selftext);
                    } else {
                        builder.setDescription(post.data.selftext.substring(0, 3500) + '...');
                    }
                }

                if (post.data.thumbnail && post.data.thumbnail != 'self') {
                    builder.setThumbnail(post.data.thumbnail);
                }

                const body = JSON.stringify({ embeds: [builder.toJSON()] });

                postqueue.push({ hook: entry.get('hook') as string, body: body });
            }

            if (post.data.created_utc > maxTime) {
                maxTime = post.data.created_utc;
            }
        });
        Hooks.update({ lastPostTimestamp: maxTime }, { where: { hook: entry.get('hook'), sub: entry.get('sub') } });
    });

    // for each entry in db,
    // fetch new reddit posts
    // send webhook for any posts with timestamp > last timestamp
    // update db entry with max timestamp
}

async function doPost() {
    const entry = postqueue.shift();
    if (entry) {
        // Assumes success for now. Should probably check for error statuses at some point.
        const res = await fetch(entry.hook, {
            method: 'POST',
            body: entry.body,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
// 5 minute update timer
setInterval(doUpdate, 1000 * 60 * 5);
// 500 ms interval to prevent rate limiting
setInterval(doPost, 500);
