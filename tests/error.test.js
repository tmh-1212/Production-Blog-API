const request = require("supertest");
const app = require("../app");
const errorHandler = require("../middleware/errorMiddleware");

jest.setTimeout(30000);

describe("API Error Handling Tests", () => {
    test("Register without email should fail", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "No Email User",
                password: "123456"
            });

        expect(response.statusCode).toBe(400);
    });

    test("Login with wrong password should fail", async () => {
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Wrong Password User",
                email: "wrong@test.com",
                password: "123456"
            });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "wrong@test.com",
                password: "wrongpassword"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid credentials");
    });

    test("Access invalid route should return 404", async () => {
        const response = await request(app)
            .get("/api/not-existing-route");

        expect(response.statusCode).toBe(404);
    });

    test("Get post with invalid ObjectId should handle CastError and return 400", async () => {
        const response = await request(app)
            .get("/api/posts/invalid_mongo_id_123");

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("Invalid _id");
    });

    describe("Mongoose Error Handler Unit Tests", () => {
        let req, res, next;

        beforeEach(() => {
            req = { originalUrl: "/test", method: "GET" };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            next = jest.fn();
        });

        test("Should format Mongoose CastError properly", () => {
            const castError = {
                name: "CastError",
                path: "_id",
                value: "123bad",
                message: "Cast to ObjectId failed"
            };

            errorHandler(castError, req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Invalid _id: 123bad"
            });
        });

        test("Should format Mongoose ValidationError properly", () => {
            const validationError = {
                name: "ValidationError",
                errors: {
                    title: { message: "Title is required" },
                    category: { message: "Category is invalid" }
                }
            };

            errorHandler(validationError, req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Title is required, Category is invalid"
            });
        });

        test("Should format Mongoose Duplicate Key (11000) error properly", () => {
            const dupError = {
                code: 11000,
                keyValue: { email: "test@example.com" },
                message: "E11000 duplicate key error"
            };

            errorHandler(dupError, req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Duplicate field value entered: email"
            });
        });
    });
});