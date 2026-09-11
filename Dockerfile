# Use Node 18
FROM node:18-bullseye-slim

WORKDIR /usr/src/app
ENV NODE_ENV=development

# Install system deps required by Prisma
RUN apt-get update && apt-get install -y --no-install-recommends build-essential python3 && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml* ./

# Install pnpm then dependencies
RUN npm ci -g pnpm && pnpm fetch

COPY . .

RUN pnpm install --frozen-lockfile --offline || pnpm install

RUN npx prisma generate

EXPOSE 3000
CMD ["pnpm", "dev"]
