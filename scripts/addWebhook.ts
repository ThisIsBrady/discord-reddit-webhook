import { Hooks } from '../src/db.js';

const sub = process.argv[2];
const hook = process.argv[3];
const timestamp = process.argv[4];

// TODO: Verify webhook url
// TODO: Verify subreddit

console.log(`Adding Sub ${sub} to hook ${hook}`);

await Hooks.create({
    sub: sub,
    hook: hook,
    lastPostTimestamp: timestamp,
});
