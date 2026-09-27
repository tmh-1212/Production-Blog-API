const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const { generateAccessToken } = require("../utils/jwt");

describe("Admin API", () => {

    let admin;
    let user;
    let adminToken;
    let userToken;

    beforeEach(async () => {

        await User.deleteMany({});

        admin = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "password123",
            role: "admin",
            emailVerified: true
        });

        user = await User.create({
            name: "Normal User",
            email: "user@example.com",
            password: "password123",
            role: "user",
            emailVerified: true
        });

        adminToken = generateAccessToken(admin._id);
        userToken = generateAccessToken(user._id);
    });


    test("Admin can block a user", async () => {

        const response = await request(app)
            .put(`/api/admin/users/${user._id}/block`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("User blocked");
        expect(response.body.user.status).toBe("blocked");

        const updatedUser = await User.findById(user._id);

        expect(updatedUser.status).toBe("blocked");
    });


    test("Admin can unblock a blocked user", async () => {

        user.status = "blocked";
        await user.save();

        const response = await request(app)
            .put(`/api/admin/users/${user._id}/unblock`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("User activated");
        expect(response.body.user.status).toBe("active");

        const updatedUser = await User.findById(user._id);

        expect(updatedUser.status).toBe("active");
    });


    test("Non-admin user cannot block a user", async () => {

        const response = await request(app)
            .put(`/api/admin/users/${user._id}/block`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(403);
    });


    test("Unauthenticated user cannot block a user", async () => {

        const response = await request(app)
            .put(`/api/admin/users/${user._id}/block`);

        expect(response.statusCode).toBe(401);
    });


    test("Admin receives 404 when blocking a non-existent user", async () => {

        const fakeId = "507f1f77bcf86cd799439011";

        const response = await request(app)
            .put(`/api/admin/users/${fakeId}/block`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("Admin receives 404 when unblocking a non-existent user", async () => {

        const fakeId = "507f1f77bcf86cd799439011";

        const response = await request(app)
            .put(`/api/admin/users/${fakeId}/unblock`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });

});
