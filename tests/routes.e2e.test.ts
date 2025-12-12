import request from "supertest";
import bcrypt from "bcrypt";

// Set required env vars before app import
process.env.JWT_ACCESS_SECRET = "test-access-secret";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
process.env.DATABASE_URL = "file:./test.db";

// Mock in-memory repositories used by the routes/controllers
jest.mock("../src/infra/container", () => {
  const data = {
    users: [] as any[],
    games: [] as any[],
    reviews: [] as any[],
    tokens: [] as any[]
  };

  const reset = () => {
    data.users = [
      {
        id: 1,
        name: "Admin",
        email: "admin@test.com",
        password: bcrypt.hashSync("admin123", 10),
        role: "ADMIN"
      }
    ];
    data.games = [];
    data.reviews = [];
    data.tokens = [];
  };

  reset();

  const userRepository = {
    async create(user: { name: string; email: string; password: string; role?: string }) {
      const entity = { id: data.users.length + 1, role: user.role ?? "USER", ...user };
      data.users.push(entity);
      return entity;
    },
    async findByEmail(email: string) {
      return data.users.find(u => u.email === email) ?? null;
    },
    async findById(id: number) {
      return data.users.find(u => u.id === id) ?? null;
    }
  };

  const gameRepository = {
    async create(dataInput: { title: string; genre: string }) {
      const game = {
        id: data.games.length + 1,
        avgRating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...dataInput
      };
      data.games.push(game);
      return game;
    },
    async update(dataInput: { id: number; title?: string; genre?: string }) {
      const game = data.games.find(g => g.id === dataInput.id)!;
      Object.assign(game, dataInput);
      return game;
    },
    async delete(id: number) {
      data.games = data.games.filter(g => g.id !== id);
    },
    async findById(id: number) {
      return data.games.find(g => g.id === id) ?? null;
    },
    async findByTitle(title: string) {
      return data.games.find(g => g.title === title) ?? null;
    },
    async findAll() {
      return [...data.games];
    },
    async updateAvgRating(gameId: number) {
      const related = data.reviews.filter(r => r.gameId === gameId);
      const avg = related.length ? related.reduce((sum, r) => sum + r.rating, 0) / related.length : 0;
      const game = data.games.find(g => g.id === gameId);
      if (game) game.avgRating = avg;
    }
  };

  const reviewRepository = {
    async create(review: { rating: number; comment: string; gameId: number; authorId: number }) {
      const entity = { id: data.reviews.length + 1, createdAt: new Date(), updatedAt: new Date(), ...review };
      data.reviews.push(entity);
      return entity;
    },
    async update(id: number, payload: { rating?: number; comment?: string }) {
      const review = data.reviews.find(r => r.id === id)!;
      Object.assign(review, payload, { updatedAt: new Date() });
      return review;
    },
    async delete(id: number) {
      data.reviews = data.reviews.filter(r => r.id !== id);
    },
    async findById(id: number) {
      return data.reviews.find(r => r.id === id) ?? null;
    },
    async findByGameId(gameId: number) {
      return data.reviews.filter(r => r.gameId === gameId);
    },
    async findByAuthorAndGame(authorId: number, gameId: number) {
      return data.reviews.find(r => r.authorId === authorId && r.gameId === gameId) ?? null;
    }
  };

  const refreshTokenRepository = {
    async create(token: { token: string; userId: number; expiresAt: Date }) {
      const entity = { id: data.tokens.length + 1, ...token };
      data.tokens.push(entity);
      return entity;
    },
    async findByToken(token: string) {
      return data.tokens.find(t => t.token === token) ?? null;
    },
    async deleteByToken(token: string) {
      data.tokens = data.tokens.filter(t => t.token !== token);
    }
  };

  return {
    userRepository,
    gameRepository,
    reviewRepository,
    refreshTokenRepository,
    __data: data,
    __reset: reset
  };
});

import { app } from "../src/infra/http/app";
import * as container from "../src/infra/container";

const reset = (container as any).__reset as () => void;

describe("API routes (in-memory)", () => {
  beforeEach(() => {
    reset();
  });

  it("registers user, logs in, admin creates game, user reviews, and lists", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      name: "User",
      email: "user@test.com",
      password: "123456"
    });
    expect(registerRes.status).toBe(201);

    const userLogin = await request(app).post("/api/auth/login").send({
      email: "user@test.com",
      password: "123456"
    });
    expect(userLogin.status).toBe(200);
    const userToken = userLogin.body.accessToken;

    const adminLogin = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "admin123"
    });
    expect(adminLogin.status).toBe(200);
    const adminToken = adminLogin.body.accessToken;

    const createGame = await request(app)
      .post("/api/games")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Elden Ring", genre: "RPG" });
    expect(createGame.status).toBe(201);
    const gameId = createGame.body.id;

    const reviewRes = await request(app)
      .post(`/api/games/${gameId}/reviews`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ rating: 5, comment: "Great game" });
    expect(reviewRes.status).toBe(201);

    const listReviews = await request(app).get(`/api/games/${gameId}/reviews`);
    expect(listReviews.status).toBe(200);
    expect(listReviews.body.length).toBe(1);

    const listGames = await request(app).get("/api/games");
    expect(listGames.status).toBe(200);
    expect(listGames.body.length).toBe(1);
  });

  it("refreshes an access token", async () => {
    const adminLogin = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "admin123"
    });
    expect(adminLogin.status).toBe(200);

    const refreshRes = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: adminLogin.body.refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.accessToken).toBeTruthy();
  });
});
