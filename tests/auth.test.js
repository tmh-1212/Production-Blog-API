const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

jest.setTimeout(30000);

test("Login user", async () => {

    // 1. Create user
    await request(app)
        .post("/api/auth/register")
        .send({
            name: "Test User",
            email: "test@example.com",
            password: "password123"
        });

    // 2. Get verification token from test database
    const user = await User.findOne({
        email: "test@example.com"
    });

    expect(user).toBeDefined();
    expect(user.emailVerificationToken).toBeDefined();

    // 3. Verify email
    const verifyResponse = await request(app)
        .get(`/api/auth/verify-email/${user.emailVerificationToken}`);

    expect(verifyResponse.statusCode).toBe(200);

    // 4. Login
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "test@example.com",
            password: "password123"
        });

    // 5. Check login
    expect(response.statusCode).toBe(200);
    expect(response.body.data.accessToken).toBeDefined();
});