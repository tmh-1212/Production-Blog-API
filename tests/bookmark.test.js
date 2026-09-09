const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
jest.setTimeout(30000);

require("dotenv").config({
    path: "tests/.env.test"
});

describe("Bookmark API Integration Tests", () => {

    let token;
    let postIdA;
    let postIdB;

 beforeAll(async () => {

    // 1. Register user
    const register = await request(app)
        .post("/api/auth/register")
        .send({
            name: "Bookmark Tester",
            email: "bookmark@test.com",
            password: "12345678"
        });

    expect(register.statusCode).toBe(201);

    // 2. Get verification token from test database
    const user = await User.findOne({
        email: "bookmark@test.com"
    });

    expect(user).toBeDefined();
    expect(user.emailVerificationToken).toBeDefined();

    // 3. Verify email
    const verifyResponse = await request(app)
        .get(`/api/auth/verify-email/${user.emailVerificationToken}`);

    expect(verifyResponse.statusCode).toBe(200);

    // 4. Login
    const login = await request(app)
        .post("/api/auth/login")
        .send({
            email: "bookmark@test.com",
            password: "12345678"
        });

    expect(login.statusCode).toBe(200);

    // 5. Get access token
    token = login.body.data.accessToken;

    expect(token).toBeDefined();

    // 6. Create first post
    const postA = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Bookmark Post A",
            description: "First post to bookmark",
            category: "Testing"
        });

    expect(postA.statusCode).toBe(201);

    postIdA = postA.body.post._id;

    // 7. Create second post
    const postB = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Bookmark Post B",
            description: "Second post to bookmark",
            category: "Testing"
        });

    expect(postB.statusCode).toBe(201);

    postIdB = postB.body.post._id;
});

    // ─── ADD BOOKMARK ────────────────────────────────────

    test("Bookmark a post", async () => {
        const res = await request(app)
            .post(`/api/posts/${postIdA}/bookmark`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/bookmarked/i);
    });


    test("Bookmark a second post", async () => {
        const res = await request(app)
            .post(`/api/posts/${postIdB}/bookmark`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });


    test("Reject bookmark without authentication", async () => {
        const res = await request(app)
            .post(`/api/posts/${postIdA}/bookmark`);

        expect(res.statusCode).toBe(401);
    });


    test("bookmarksCount increments on the post", async () => {
        const res = await request(app)
            .get(`/api/posts/${postIdA}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.post.bookmarksCount).toBeGreaterThanOrEqual(1);
    });


    // ─── GET BOOKMARKS ───────────────────────────────────

    test("Get my bookmarks returns bookmarked posts", async () => {
        const res = await request(app)
            .get("/api/posts/bookmarks")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.bookmarks)).toBe(true);
        expect(res.body.bookmarks.length).toBe(2);
    });


    test("Bookmarks list includes pagination metadata", async () => {
        const res = await request(app)
            .get("/api/posts/bookmarks?page=1&limit=1")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.pagination).toBeDefined();
        expect(res.body.pagination.totalBookmarks).toBe(2);
        expect(res.body.pagination.totalPages).toBe(2);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.limit).toBe(1);
        expect(res.body.bookmarks.length).toBe(1);
    });


    test("Reject fetching bookmarks without authentication", async () => {
        const res = await request(app)
            .get("/api/posts/bookmarks");

        expect(res.statusCode).toBe(401);
    });


    // ─── REMOVE BOOKMARK ─────────────────────────────────

    test("Unbookmark a post", async () => {
        const res = await request(app)
            .delete(`/api/posts/${postIdA}/bookmark`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/removed|unbookmark/i);
    });


    test("Bookmarks list decreases after unbookmark", async () => {
        const res = await request(app)
            .get("/api/posts/bookmarks")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.bookmarks.length).toBe(1);
    });


    test("bookmarksCount decrements on the post after unbookmark", async () => {
        const res = await request(app)
            .get(`/api/posts/${postIdA}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.post.bookmarksCount).toBe(0);
    });


    test("Reject unbookmark without authentication", async () => {
        const res = await request(app)
            .delete(`/api/posts/${postIdB}/bookmark`);

        expect(res.statusCode).toBe(401);
    });


    // ─── CLEANUP ─────────────────────────────────────────

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});
