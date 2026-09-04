COMPOSE := docker compose
API_BASE_URL ?= http://localhost:8080

.PHONY: dev backend app sync health stop reset logs

dev: backend

backend:
	$(COMPOSE) up --build

app:
	cd pokedex-app && npm start

sync:
	curl -X POST $(API_BASE_URL)/api/pokemon/sync

health:
	curl $(API_BASE_URL)/api/health

stop:
	$(COMPOSE) down

reset:
	$(COMPOSE) down -v

logs:
	$(COMPOSE) logs -f
