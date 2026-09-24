const jwt = require("jsonwebtoken");
const request = require("supertest");

const app = require("../app");

const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

jest.setTimeout(30000);

describe(
"User API",
()=>{


let token;

beforeAll(async()=>{

    await connectDB(
        process.env.MONGO_URI
    );

});

beforeEach(async()=>{

 const collections =
    mongoose.connection.collections;


    for(const key in collections){

        await collections[key].deleteMany({});

    }
// Register user

const register =
await request(app)

.post("/api/auth/register")

.send({

name:"Protected User",

email:"protected@gmail.com",

password:"password123"

});



// Save token

token =
register.body.data.accessToken;


});





test(
"Get profile without token",
async()=>{


const response =
await request(app)

.get("/api/users/profile");



expect(
response.statusCode
)
.toBe(401);



});







test(
"Get profile with valid token",
async()=>{


const response =
await request(app)

.get("/api/users/profile")

.set(
"Authorization",
`Bearer ${token}`
);



expect(
response.statusCode
)
.toBe(200);



expect(
response.body.success
)
.toBe(true);

console.log(response.body);

expect(
response.body.user.email
)
.toBe(
"protected@gmail.com"
);





});

test(
"Get profile with invalid token",
async()=>{


const response =
await request(app)

.get("/api/users/profile")

.set(
"Authorization",
"Bearer invalid_token"
);



expect(
response.statusCode
)
.toBe(401);



});


test("Reject expired token", async () => {

    const register = await request(app)
        .post("/api/auth/register")
        .send({
            name: "Expired User",
            email: "expired@gmail.com",
            password: "password123"
        });

    const userId = register.body.data.user._id;

    const expiredToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "-10s"
        }
    );

    const response = await request(app)
        .get("/api/users/profile")
        .set(
            "Authorization",
            `Bearer ${expiredToken}`
        );

    expect(response.statusCode).toBe(401);

});

test("Change password with valid credentials", async () => {
    const response = await request(app)
        .put("/api/users/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
            currentPassword: "password123",
            newPassword: "newpassword123"
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Password updated successfully");
});
test("Reject password change with incorrect current password", async () => {
    const response = await request(app)
        .put("/api/users/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
            currentPassword: "wrongpassword",
            newPassword: "newpassword123"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
});
test("Reject password change without authentication", async () => {
    const response = await request(app)
        .put("/api/users/password")
        .send({
            currentPassword: "password123",
            newPassword: "newpassword123"
        });

    expect(response.statusCode).toBe(401);
});
test("Reject password change when current password is missing", async () => {
    const response = await request(app)
        .put("/api/users/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
            newPassword: "newpassword123"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
});
test("Reject password change when new password is missing", async () => {
    const response = await request(app)
        .put("/api/users/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
            currentPassword: "password123"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
});
test("Reject password change when new password is shorter than 8 characters", async () => {
    const response = await request(app)
        .put("/api/users/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
            currentPassword: "password123",
            newPassword: "1234567"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
});
test("Reject password change when new password exceeds 30 characters", async () => {
    const response = await request(app)
        .put("/api/users/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
            currentPassword: "password123",
            newPassword: "1234567890123456789012345678901"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
});
test("Password change updates login credentials", async () => {
    const user = await User.findOne({ email: "protected@gmail.com" });

    const verifyResponse = await request(app)
        .get(`/api/auth/verify-email/${user.emailVerificationToken}`);

    expect(verifyResponse.statusCode).toBe(200);

    const changeResponse = await request(app)
        .put("/api/users/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
            currentPassword: "password123",
            newPassword: "newpassword123"
        });

    expect(changeResponse.statusCode).toBe(200);

    const oldLogin = await request(app)
        .post("/api/auth/login")
        .send({
            email: "protected@gmail.com",
            password: "password123"
        });

    expect(oldLogin.statusCode).toBe(401);
    expect(oldLogin.body.success).toBe(false);

    const newLogin = await request(app)
        .post("/api/auth/login")
        .send({
            email: "protected@gmail.com",
            password: "newpassword123"
        });

    expect(newLogin.statusCode).toBe(200);
    expect(newLogin.body.data.accessToken).toBeDefined();
});
test("Get paginated user bookmarks", async () => {
    const response = await request(app)
        .get("/api/users/bookmarks?page=1&limit=5")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.pagination).toBeDefined();
    expect(response.body.pagination.page).toBe(1);
    expect(response.body.pagination.limit).toBe(5);
    expect(Array.isArray(response.body.bookmarks)).toBe(true);
});

});
