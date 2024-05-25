# discord-reddit-webhook

Query subreddits for new posts and publish them to a Discord Webhook.

Used for the [Chunky Renderer's][chunky-renderer] community [Discord Server][chunky-discord]

## Quick start guide

-   Requires [NodeJS][node-js] and [Yarn][yarn]
-   Install dependencies with `yarn install`
-   Add a subreddit to follow by running `yarn addHook [r/subreddit] [webhook_link]`
-   Run script with `yarn start`

The script will query the subreddit for new posts every 5 minutes and post an embed to the Webhook URL.

The `addHook` script can be run multiple times for multiple subreddits or multiple webhooks. Subreddits cannot be removed currently without deleting the database file and redoing the setup for the remaining subreddits, but it is planned to be able to remove them individually eventually.

[chunky-renderer]: https://github.com/chunky-dev/chunky
[chunky-discord]: https://discord.gg/VqcHpsF
[node-js]: https://nodejs.org/en/download/
[yarn]: https://yarnpkg.com/getting-started/install
