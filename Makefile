.PHONY: deps up down logs migrate seed build start lint test format

deps:
	pnpm install

up:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f

migrate:
	npx prisma generate
	npx prisma migrate dev --name init

seed:
	node --loader ts-node/esm prisma/seed.ts || pnpm run seed

build:
	pnpm build

start:
	pnpm start

lint:
	pnpm run lint

test:
	pnpm run test

format:
	pnpm run format
