# Game Review API

API REST para avaliação de jogos em **Node.js + TypeScript**, com **Prisma**, **JWT** (access + refresh), arquitetura em camadas e documentação via **Swagger**.

---

## Stack e recursos
- Node.js + Express + TypeScript
- Prisma (SQLite para dev, PostgreSQL para produção) com migrations e client
- JWT (access e refresh) com expiração configurável
- Swagger em `/docs`
- Testes com Jest

---

## Requisitos
- Node.js >= 18
- npm (ou pnpm/yarn, adaptando comandos)
- SQLite (usa arquivo `prisma/dev.db` por padrão)

---

## Configuração
1. Copie o arquivo de variáveis:
   ```bash
   cp .env.example .env
   ```
2. Ajuste valores conforme necessário:
   - `DATABASE_URL`: conexão do banco (padrão SQLite local)
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: segredos dos tokens
   - `ACCESS_TOKEN_EXPIRES_IN`: duração do access token (ex: 15m)
   - `REFRESH_TOKEN_EXPIRES_IN`: duração do refresh token (ex: 7d)
   - `PORT`: porta HTTP (padrão 3333)

---

## Rodando o projeto
- Instalar dependências:
  ```bash
  npm install
  ```
- Aplicar migrations e gerar o client:
  ```bash
  npx prisma migrate dev --name init
  npx prisma generate
  ```
- Ambiente de desenvolvimento:
  ```bash
  npm run dev
  ```
- Build + produção:
  ```bash
  npm run build
  npm start
  ```
- Testes:
  ```bash
  npm test
  ```

- API base: `http://localhost:3333/api`
- Swagger: `http://localhost:3333/docs`

---

## Autenticação e perfis
- Autenticação via Bearer token (`Authorization: Bearer <access_token>`).
- Fluxo: `POST /api/auth/login` retorna `accessToken` e `refreshToken`; `POST /api/auth/refresh` gera novo access token.
- Perfis: `USER` (padrão) e `ADMIN`. Apenas admins podem criar/editar/deletar jogos. Reviews só podem ser editadas/deletadas pelo autor ou admin.

---

## Regras de negócio
- Uma review por jogo por usuário.
- Média (`avgRating`) recalculada a cada criação/edição/exclusão de review.
- Jogos: CRUD somente por admin.
- Reviews: comentário opcional, máx. 500 caracteres.

---

## Rotas principais
### Autenticação
- `POST /api/auth/register` - body: `{ name, email, password }`
- `POST /api/auth/login` - body: `{ email, password }`
- `POST /api/auth/refresh` - body: `{ refreshToken }`

### Jogos
- `GET /api/games` - lista jogos
- `GET /api/games/:id` - detalhe
- `GET /api/games/:id/reviews` - reviews do jogo
- `POST /api/games` (admin) - body: `{ title, genre }`
- `PUT /api/games/:id` (admin) - body: `{ title?, genre? }`
- `DELETE /api/games/:id` (admin)
- `POST /api/games/:id/reviews` (autenticado) - body: `{ rating (1-5), comment? }`

### Reviews
- `POST /api/reviews/game/:gameId` (autenticado) - body: `{ rating (1-5), comment? }`
- `PUT /api/reviews/:id` (autor ou admin) - body: `{ rating?, comment? }`
- `DELETE /api/reviews/:id` (autor ou admin)
- `GET /api/reviews/game/:gameId` - público

---

## Modelo de dados (Prisma)
- Usuário: `id`, `name`, `email`, `password`, `role` (USER/ADMIN)
- Game: `id`, `title`, `genre`, `avgRating`
- Review: `id`, `rating`, `comment`, `gameId`, `authorId`
- RefreshToken: `id`, `token`, `userId`, `expiresAt`

---

## Erros e formatos
- Resposta de erro padrão: `{"error": "mensagem"}`
- JWT expirado ou ausente retorna 401; acesso sem permissão retorna 403.

---

## Deploy em produção (Render)

Esta API está hospedada em **produção** na plataforma **Render**, com banco de dados **PostgreSQL gerenciado** e deploy automatizado via GitHub.

### URLs de produção
- **API:** `https://game-review-api-final.onrender.com`
- **Swagger:** `https://game-review-api-final.onrender.com/docs`

### Endpoints principais (prod)
- `POST /auth/register` — cria usuário
- `POST /auth/login` — retorna `accessToken` e `refreshToken`
- `POST /auth/refresh` — gera novo access token
- `GET /games` — lista jogos
- `POST /games` — cria jogo (ADMIN)
- `POST /reviews/:gameId` — cria review (USER autenticado)

### Arquitetura de deploy
- Plataforma: Render (Web Service — Node.js)
- Banco de dados: PostgreSQL (Render Managed Database)
- ORM: Prisma
- Ambiente: Production
- Porta: gerenciada automaticamente pelo Render (`process.env.PORT`)

### Variáveis de ambiente utilizadas
- `DATABASE_URL` — URL interna do PostgreSQL fornecida pelo Render
- `JWT_ACCESS_SECRET` — segredo para geração do Access Token (JWT)
- `JWT_REFRESH_SECRET` — segredo para geração do Refresh Token (JWT)
- `ACCESS_TOKEN_EXPIRES_IN` — exemplo: `15m`
- `REFRESH_TOKEN_EXPIRES_IN` — exemplo: `7d`
- `NODE_ENV` — `production`
- Recomenda-se `NPM_CONFIG_PRODUCTION=false` no Render para garantir instalação de devDependencies usadas no build (tipos TS)

### Comandos de build/start no Render
- Build Command: `npm install && npm run build && npm run prisma:generate:prod && npm run prisma:migrate:prod`
- Start Command: `npm start`

