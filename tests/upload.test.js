const request = require("supertest");
const path = require("path");
const fs = require("fs");
const app = require("../app");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

jest.setTimeout(30000);

require("dotenv").config({
    path: "tests/.env.test"
});

describe("Upload Middleware Tests", () => {
    let token;
    let smallImagePath;
    let largeFilePath;
    let textFilePath;

    beforeAll(async () => {
        await connectDB(process.env.MONGO_URI);

        // Register user and get token
        const register = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Upload Tester",
                email: "upload@test.com",
                password: "password123"
            });

        token = register.body.data.accessToken;

        // Create temporary test files
        const testTmpDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(testTmpDir)) {
            fs.mkdirSync(testTmpDir, { recursive: true });
        }

        // Small image file (1 KB)
        smallImagePath = path.join(testTmpDir, "test_small.png");
        const smallBuffer = Buffer.alloc(1024, "a");
        fs.writeFileSync(smallImagePath, smallBuffer);

        // Large file (> 2 MB: 2.5 MB)
        largeFilePath = path.join(testTmpDir, "test_large.jpg");
        const largeBuffer = Buffer.alloc(2.5 * 1024 * 1024, "b");
        fs.writeFileSync(largeFilePath, largeBuffer);

        // Non-image text file
        textFilePath = path.join(testTmpDir, "test_doc.txt");
        fs.writeFileSync(textFilePath, "This is not an image");
    });

    afterAll(async () => {
        // Clean up temporary test files
        const testTmpDir = path.join(__dirname, "tmp");
        if (fs.existsSync(testTmpDir)) {
            fs.rmSync(testTmpDir, { recursive: true, force: true });
        }

        await mongoose.connection.close();
    });

    test("Should upload profile avatar to uploads/avatars folder", async () => {
        const response = await request(app)
            .put("/api/users/profile")
            .set("Authorization", `Bearer ${token}`)
            .attach("avatar", smallImagePath)
            .field("name", "Updated Name");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.user.avatar).toContain("uploads/avatars");

        // Verify file actually exists on disk
        const avatarFilename = path.basename(response.body.user.avatar);
        const diskPath = path.join(process.cwd(), "uploads", "avatars", avatarFilename);
        expect(fs.existsSync(diskPath)).toBe(true);

        // Cleanup created file
        if (fs.existsSync(diskPath)) {
            fs.unlinkSync(diskPath);
        }
    });

    test("Should upload post image to correct uploads folder", async () => {
        const response = await request(app)
            .post("/api/posts")
            .set("Authorization", `Bearer ${token}`)
            .attach("image", smallImagePath)
            .field("title", "Post with Upload Image")
            .field("description", "Testing image upload path")
            .field("category", "Technology");

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.post.image).toBeTruthy();

        // Verify file exists on disk
        const imagePath = response.body.post.image.replace(/\\/g, "/");
        const diskPath = path.join(process.cwd(), imagePath);
        expect(fs.existsSync(diskPath)).toBe(true);

        // Cleanup created file
        if (fs.existsSync(diskPath)) {
            fs.unlinkSync(diskPath);
        }
    });

    test("Should reject file exceeding 2MB limit with 400 Bad Request", async () => {
        const response = await request(app)
            .put("/api/users/profile")
            .set("Authorization", `Bearer ${token}`)
            .attach("avatar", largeFilePath);

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("File size limit exceeded");
    });

    test("Should reject non-image file with 400 Bad Request", async () => {
        const response = await request(app)
            .put("/api/users/profile")
            .set("Authorization", `Bearer ${token}`)
            .attach("avatar", textFilePath);

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("Only images are allowed");
    });
});
