set-up-db:
	docker compose up -d db
	cd ./backend && npm run prisma:migrate
	cd ./backend && npm run prisma:generate
	cd ./backend && npm run prisma:seed

run-backend:
	cd ./backend && npm run dev

run-frontend:
	cd ./frontend && npm run dev

run-all:
	make run-backend & make run-frontend