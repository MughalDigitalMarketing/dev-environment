# Development environment template

This repository contains a ready-to-use local development environment scaffold for:
- Node.js 18 + TypeScript + Express
- Prisma ORM (Postgres)
- Redis
- Docker Compose (db, redis, adminer, app)
- devcontainer for VS Code / Codespaces
- ESLint + Prettier
- Jest testing scaffold
- GitHub Actions CI workflow

Quickstart (Docker - recommended)

1. Clone
   git clone https://github.com/MughalDigitalMarketing/dev-environment.git
   cd dev-environment

2. Copy env and run
   cp .env.example .env
   docker compose up --build

3. Open http://localhost:3000

Native setup (requires Node 18 + pnpm)

1. Install Node 18 (use nvm)
2. pnpm install
3. cp .env.example .env
4. npx prisma generate
5. npx prisma migrate dev --name init
6. pnpm run seed
7. pnpm run dev

Devcontainer / Codespaces

Open the repo in Codespaces or VS Code Remote Container; the container will run pnpm install on create.

Files of interest
- src/: application source
- prisma/: schema & seed
- docker-compose.yml: services for dev
- .devcontainer/: devcontainer config
- .github/workflows/ci.yml: CI pipeline

Next steps
- Customize the schema and seed data
- Add application routes and tests
- Configure environment secrets for production
