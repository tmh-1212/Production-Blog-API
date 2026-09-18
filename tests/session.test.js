const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const Session = require("../models/Session");

jest.setTimeout(30000);

describe("Session API Integration Tests", () => {

    let tokenA;
    let tokenB;
    let sessionAId;
    let sessionBId;

    beforeAll(async () => {

        // User A
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Session Tester A",
                email: "session-a@test.com",
                password: "12345678"
            });

        const userA = await User.findOne({
            email: "session-a@test.com"
        });

        expect(userA).toBeDefined();
        expect(userA.emailVerificationToken).toBeDefined();

        await request(app)
            .get(`/api/auth/verify-email/${userA.emailVerificationToken}`);

        const loginA = await request(app)
            .post("/api/auth/login")
            .send({
                email: "session-a@test.com",
                password: "12345678"
            });

        expect(loginA.statusCode).toBe(200);
        tokenA = loginA.body.data.accessToken;

        // User B
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Session Tester B",
                email: "session-b@test.com",
                password: "12345678"
            });

        const userB = await User.findOne({
            email: "session-b@test.com"
        });

        expect(userB).toBeDefined();
        expect(userB.emailVerificationToken).toBeDefined();

        await request(app)
            .get(`/api/auth/verify-email/${userB.emailVerificationToken}`);

        const loginB = await request(app)
            .post("/api/auth/login")
            .send({
                email: "session-b@test.com",
                password: "12345678"
            });

        expect(loginB.statusCode).toBe(200);
        tokenB = loginB.body.data.accessToken;

        // Get the sessions created by login
        const sessionsA = await Session.find({
            user: userA._id
        });

        const sessionsB = await Session.find({
            user: userB._id
        });

        expect(sessionsA.length).toBeGreaterThanOrEqual(1);
        expect(sessionsB.length).toBeGreaterThanOrEqual(1);

        sessionAId = sessionsA[0]._id.toString();
        sessionBId = sessionsB[0]._id.toString();
    });


    test("Reject getting sessions without authentication", async () => {

        const res = await request(app)
            .get("/api/sessions");

        expect(res.statusCode).toBe(401);
    });


    test("Authenticated user can get their own sessions", async () => {

        const res = await request(app)
            .get("/api/sessions")
            .set("Authorization", `Bearer ${tokenA}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.count).toBeGreaterThanOrEqual(1);
        expect(res.body.data[0].refreshToken).toBeUndefined();

        const returnedIds = res.body.data.map(
            session => session._id
        );

        expect(returnedIds).toContain(sessionAId);
        expect(returnedIds).not.toContain(sessionBId);
    });


    test("User can delete their own session", async () => {

        const res = await request(app)
            .delete(`/api/sessions/${sessionAId}`)
            .set("Authorization", `Bearer ${tokenA}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe(
            "Session removed successfully"
        );

        const deletedSession = await Session.findById(
            sessionAId
        );

        expect(deletedSession).toBeNull();
    });


    test("User cannot delete another user's session", async () => {

        const res = await request(app)
            .delete(`/api/sessions/${sessionBId}`)
            .set("Authorization", `Bearer ${tokenA}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);

        const sessionStillExists = await Session.findById(
            sessionBId
        );

        expect(sessionStillExists).not.toBeNull();
    });


    test("Deleting a nonexistent session returns 404", async () => {

        const fakeSessionId =
            new mongoose.Types.ObjectId();

        const res = await request(app)
            .delete(`/api/sessions/${fakeSessionId}`)
            .set("Authorization", `Bearer ${tokenA}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });


    test("User can delete all of their own sessions", async () => {

        // Create another session for User A directly for this
        // service behavior test.
        const userA = await User.findOne({
            email: "session-a@test.com"
        });

        await Session.create({
            user: userA._id,
            refreshToken: "test-session-refresh-token-a",
            current: true,
            lastActivity: new Date(),
            expiresAt: new Date(Date.now() + 86400000)
        });

        const beforeDelete = await Session.countDocuments({
            user: userA._id
        });

        expect(beforeDelete).toBeGreaterThanOrEqual(1);

        const res = await request(app)
            .delete("/api/sessions")
            .set("Authorization", `Bearer ${tokenA}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe(
            "All sessions removed successfully"
        );

        const remainingA = await Session.countDocuments({
            user: userA._id
        });

        const remainingB = await Session.countDocuments({
            user: (
                await User.findOne({
                    email: "session-b@test.com"
                })
            )._id
        });

        expect(remainingA).toBe(0);
        expect(remainingB).toBeGreaterThanOrEqual(1);
    });

});
