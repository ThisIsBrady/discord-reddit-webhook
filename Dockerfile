FROM node:lts
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
RUN apt update && \
    apt install tzdata sqlite3 libsqlite3-dev -y && \
    corepack enable && \
    yarn workspaces focus --production && \
    npm_config_build_from_source=true yarn install --immutable
COPY scripts ./scripts
COPY src ./src
RUN yarn tsc
CMD ["yarn", "prod"]
