const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

jest.setTimeout(30000);

require("dotenv").config({
    path: "tests/.env.test"
});

describe("Comment API Integration Tests", () => {

    let tokenA;
    let tokenB;
    let postId;
    let commentId;

    // Register two users and create a post to comment on
    beforeAll(async () => {

        // User A — post author and comment creator
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Comment Tester A",
                email: "comment-a@test.com",
                password: "12345678"
            });

        const loginA = await request(app)
            .post("/api/auth/login")
            .send({
                email: "comment-a@test.com",
                password: "12345678"
            });

        tokenA = loginA.body.data.accessToken;

        // User B — second user for ownership tests
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Comment Tester B",
                email: "comment-b@test.com",
                password: "12345678"
            });

        const loginB = await request(app)
            .post("/api/auth/login")
            .send({
                email: "comment-b@test.com",
                password: "12345678"
            });

        tokenB = loginB.body.data.accessToken;

        // Create a published post to attach comments to
        const postRes = await request(app)
            .post("/api/posts")
            .set("Authorization", `Bearer ${tokenA}`)
            .send({
                title: "Comment Test Post",
                description: "A post used to test commenting",
                category: "Testing"
            });

        postId = postRes.body.post._id;
    });


    // ─── CREATE ──────────────────────────────────────────

    test("Create a comment on a valid post", async () => {
        const res = await request(app)
            .post(`/api/comments/${postId}`)
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ text: "Great post!" });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.comment.text).toBe("Great post!");
        expect(res.body.comment.post).toBe(postId);

        commentId = res.body.comment._id;
    });


    test("Reject comment without authentication", async () => {
        const res = await request(app)
            .post(`/api/comments/${postId}`)
            .send({ text: "No token" });

        expect(res.statusCode).toBe(401);
    });


    test("Reject comment on a nonexistent post", async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .post(`/api/comments/${fakeId}`)
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ text: "Ghost post" });

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });


    test("Reject comment with empty text", async () => {
        const res = await request(app)
            .post(`/api/comments/${postId}`)
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ text: "" });

        // Mongoose validation should reject it (required field)
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });


    test("commentsCount increments after creating a comment", async () => {
        const postBefore = await request(app).get(`/api/posts/${postId}`);
        const countBefore = postBefore.body.post.commentsCount;

        await request(app)
            .post(`/api/comments/${postId}`)
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ text: "Incrementing count" });

        const postAfter = await request(app).get(`/api/posts/${postId}`);

        expect(postAfter.body.post.commentsCount).toBe(countBefore + 1);
    });


    // ─── GET ─────────────────────────────────────────────

    test("Get all comments for a post", async () => {
        const res = await request(app)
            .get(`/api/comments/${postId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.comments)).toBe(true);
        expect(res.body.comments.length).toBeGreaterThanOrEqual(1);
    });


    test("Get comments returns populated user name", async () => {
        const res = await request(app)
            .get(`/api/comments/${postId}`);

        const comment = res.body.comments.find(c => c._id === commentId);
        expect(comment).toBeDefined();
        expect(comment.user).toHaveProperty("name");
    });


    // ─── UPDATE ──────────────────────────────────────────

    test("Owner can update their own comment", async () => {
        const res = await request(app)
            .put(`/api/comments/${commentId}`)
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ text: "Updated comment text" });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.comment.text).toBe("Updated comment text");
    });


    test("Non-owner cannot update another user's comment", async () => {
        const res = await request(app)
            .put(`/api/comments/${commentId}`)
            .set("Authorization", `Bearer ${tokenB}`)
            .send({ text: "Hacked comment" });

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
    });


    test("Reject update with empty text", async () => {
        const res = await request(app)
            .put(`/api/comments/${commentId}`)
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ text: "   " });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });


    // ─── DELETE ──────────────────────────────────────────

    test("Non-owner cannot delete another user's comment", async () => {
        const res = await request(app)
            .delete(`/api/comments/${commentId}`)
            .set("Authorization", `Bearer ${tokenB}`);

        expect(res.statusCode).toBe(403);
    });


    test("Owner can delete their own comment", async () => {
        const res = await request(app)
            .delete(`/api/comments/${commentId}`)
            .set("Authorization", `Bearer ${tokenA}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });


    test("commentsCount decrements after deleting a comment", async () => {
        // Create a comment, note the count, delete it, and verify
        const createRes = await request(app)
            .post(`/api/comments/${postId}`)
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ text: "Temporary" });

        const tempId = createRes.body.comment._id;

        const postBefore = await request(app).get(`/api/posts/${postId}`);
        const countBefore = postBefore.body.post.commentsCount;

        await request(app)
            .delete(`/api/comments/${tempId}`)
            .set("Authorization", `Bearer ${tokenA}`);

        const postAfter = await request(app).get(`/api/posts/${postId}`);

        expect(postAfter.body.post.commentsCount).toBe(countBefore - 1);
    });


    // ─── CLEANUP ─────────────────────────────────────────

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});
