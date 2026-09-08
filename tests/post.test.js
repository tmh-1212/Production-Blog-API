const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Post = require("../models/Post");

jest.setTimeout(30000);

describe("Post API - Trending Endpoints", () => {
    beforeAll(async () => {
        await connectDB(process.env.MONGO_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test("Get posts list", async () => {
        const response = await request(app).get("/api/posts");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.posts)).toBe(true);
    });

    test("Get trending posts default (sorted by views)", async () => {
        const response = await request(app).get("/api/posts/trending");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.posts)).toBe(true);
        expect(response.body.pagination.sortBy).toBe("views");
    });

    test("Get trending posts sorted by likes", async () => {
        const response = await request(app).get("/api/posts/trending?sortBy=likes&limit=5");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.posts)).toBe(true);
        expect(response.body.pagination.sortBy).toBe("likes");
    });
});
