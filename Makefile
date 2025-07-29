# Nome do serviço principal (NestJS)
APP=app


# Arquivos do Docker Compose (já com -f incluído)
COMPOSE_DEV=-f docker-compose.yml -f docker-compose.override.yml
COMPOSE_PROD=-f docker-compose.yml -f docker-compose.prod.yml

# ========================
# Comandos Gerais
# ========================

# Subir containers em modo DEV (com hot reload e volumes)
up-dev:
	docker compose $(COMPOSE_DEV) up -d --build

# Subir containers em modo PROD (sem hot reload)
up-prod:
	docker compose $(COMPOSE_PROD) up -d --build

# Parar todos os containers
down:
	docker compose down

# Reiniciar containers (útil quando muda variáveis de ambiente)
restart:
	make down && make up-dev

# Ver logs do app
logs:
	docker compose logs -f $(APP)

# Entrar no container do app (shell)
sh:
	docker exec -it $(APP) sh

# ========================
# Comandos do Prisma (caso esteja usando)
# ========================

# Rodar migrations
migrate:
	docker exec -it $(APP) npx prisma migrate dev

# Rodar seeds
seed:
	docker exec -it $(APP) npx prisma db seed

# ========================
# Utilidades
# ========================

# Parar todos os containers
stop:
	docker compose stop

# Limpar containers, volumes e imagens (reset total)
clean:
	docker compose down -v --rmi all --remove-orphans
