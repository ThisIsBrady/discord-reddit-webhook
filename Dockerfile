FROM node:lts
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
RUN corepack enable && \
    yarn workspaces focus --production && \
    yarn install --immutable
COPY scripts ./scripts
COPY src ./src
RUN yarn tsc
CMD ["yarn", "prod"]
