FROM node:latest

WORKDIR /app

RUN curl -fsSL https://bun.sh/install | bash

RUN ln -s $HOME/.bun/bin/bun /usr/local/bin/bun

COPY . .

RUN bun install

RUN bun run build

ENTRYPOINT ["bun", "start"]
