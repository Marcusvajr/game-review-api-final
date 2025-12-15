# Game Review API

API REST para avaliacao de jogos, em **Node.js + TypeScript**, com **Prisma**, **JWT** (access + refresh), arquitetura em camadas e documentacao via **Swagger**.

## Stack e recursos
- Node.js + Express + TypeScript
- Prisma (SQLite) com migrations e client
- JWT (access e refresh) com expiracao configuravel
- Swagger em `/docs`
- Testes com Jest

## Requisitos
- Node.js >= 18
- npm (ou pnpm/yarn, adaptando comandos)
- SQLite (usa arquivo `prisma/dev.db` por padrao)

## Configuracao
1. Copie o arquivo de variaveis:
   ```bash
   cp .env.example .env
   ```
2. Ajuste valores conforme necessario:
   - `DATABASE_URL`: conexao do banco (padrao SQLite local)
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: segredos dos tokens
   - `ACCESS_TOKEN_EXPIRES_IN`: duracao do access token (ex: 15m)
   - `REFRESH_TOKEN_EXPIRES_IN`: duracao do refresh token (ex: 7d)
   - `PORT`: porta HTTP (padrao 3333)

## Rodando o projeto
- Instalar dependencias:
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
- Build + producao:
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

## Autenticacao e perfis
- Autenticacao via Bearer token (`Authorization: Bearer <access_token>`).
- Fluxo: `POST /api/auth/login` retorna `accessToken` e `refreshToken`; `POST /api/auth/refresh` gera novo access token.
- Perfis: `USER` (padrao) e `ADMIN`. Apenas admins podem criar/editar/deletar jogos. Reviews so podem ser editadas/deletadas pelo autor ou admin.

## Regras de negocio
- Uma review por jogo por usuario.
- Media (`avgRating`) recalculada a cada criacao/edicao/exclusao de review.
- Jogos: CRUD somente por admin.
- Reviews: comentario opcional, max 500 caracteres.

## Rotas principais
### Autenticacao
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
- `GET /api/reviews/game/:gameId` - publico

## Modelo de dados (Prisma)
- Usuario: `id`, `name`, `email`, `password`, `role` (USER/ADMIN)
- Game: `id`, `title`, `genre`, `avgRating`
- Review: `id`, `rating`, `comment`, `gameId`, `authorId`
- RefreshToken: `id`, `token`, `userId`, `expiresAt`

## Erros e formatos
- Resposta de erro padrao: `{"error": "mensagem"}`.
- JWT expirado ou ausente retorna 401; acesso sem permissao retorna 403.

## Documentacao
- Abra `http://localhost:3333/docs` com o servidor rodando para testar as rotas via Swagger UI.

## 🚀 Deploy em Produção (Render)

Esta API está hospedada em **produção** utilizando a plataforma **Render**, com banco de dados **PostgreSQL gerenciado** e deploy automatizado a partir do GitHub.

### 🌐 URL da API

* **Base URL:** [https://game-review-api-final.onrender.com](https://game-review-api-final.onrender.com)
* **Documentação Swagger:** [https://game-review-api-final.onrender.com/docs](https://game-review-api-final.onrender.com/docs)


---

### 🧱 Arquitetura de Deploy

* **Plataforma:** Render (Web Service – Node.js)
* **Banco de dados:** PostgreSQL (Render Managed Database)
* **ORM:** Prisma
* **Ambiente:** Production
* **Porta:** Gerenciada automaticamente pelo Render (`process.env.PORT`)

---

### 🔐 Variáveis de Ambiente Utilizadas

As seguintes variáveis de ambiente foram configuradas no Render:

* `DATABASE_URL` → URL interna do PostgreSQL fornecida pelo Render
* `JWT_ACCESS_SECRET` → Segredo para geração do Access Token (JWT)
* `JWT_REFRESH_SECRET` → Segredo para geração do Refresh Token (JWT)
* `ACCESS_TOKEN_EXPIRES_IN` → Exemplo: `15m`
* `REFRESH_TOKEN_EXPIRES_IN` → Exemplo: `7d`
* `NODE_ENV` → `production`

> O `PORT` **não é configurado manualmente**, pois o Render injeta automaticamente essa variável.

---

### 🧪 Build e Execução em Produção

O processo de deploy executa automaticamente:

1. Instalação das dependências
2. Geração do Prisma Client
3. Execução das migrations (`prisma migrate deploy`)
4. Build do TypeScript (`tsc`)
5. Inicialização do servidor (`node dist/server.js`)

Logs de sucesso indicam:

```text
Server running on port 10000
Your service is live 🎉
```

---

### 📌 Observações Importantes

* O plano gratuito do Render pode **pausar a instância por inatividade**, causando um atraso inicial de até ~50 segundos na primeira requisição.
* O Swagger é a principal forma de interação e validação da API em produção.
* O deploy está integrado ao GitHub, permitindo **deploy automático a cada push na branch principal**.

---

### ✅ Status do Deploy

✔ API online e acessível
✔ Banco de dados conectado
✔ Migrations aplicadas
✔ Swagger funcional

Este projeto está pronto para uso e avaliação acadêmica.
