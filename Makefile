# Nome do serviço principal (NestJS)
APP=dev_app

# Subir tudo (builda e inicia containers em segundo plano)
up:
	docker-compose up -d --build

# Derrubar os containers
down:
	docker-compose down

# Ver logs do app (NestJS)
logs:
	docker-compose logs -f $(APP)

# Entrar no container do app (shell)
sh:
	docker exec -it $(APP) sh

# Rodar migrations do Prisma (caso esteja usando)
migrate:
	docker exec -it $(APP) npx prisma migrate dev

# Parar todos os containers
stop:
	docker-compose stop

# Reiniciar (útil se mudar variáveis de ambiente)
restart: down up
