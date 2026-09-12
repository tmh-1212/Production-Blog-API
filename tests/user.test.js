const jwt = require("jsonwebtoken");
const request = require("supertest");

const app = require("../app");

const mongoose = require("mongoose");
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