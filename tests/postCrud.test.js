const request = require("supertest");
const app = require("../app");

const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");

jest.setTimeout(30000);

require("dotenv").config({
    path:"tests/.env.test"
});

describe("Post CRUD API Tests", () => {

    let token;
    let postId;


    // Create user and get token before tests
beforeAll(async () => {

    // 1. Register user
    const register = await request(app)
        .post("/api/auth/register")
        .send({
            name: "Post Tester",
            email: "post@test.com",
            password: "12345678"
        });

    expect(register.statusCode).toBe(201);


    // 2. Get verification token from test database
    const user = await User.findOne({
        email: "post@test.com"
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
            email: "post@test.com",
            password: "12345678"
        });

    expect(login.statusCode).toBe(200);


    // 5. Get access token
    token = login.body.data.accessToken;

    expect(token).toBeDefined();

    console.log("TOKEN:", token);
});


    // CREATE POST
    test("Create new post", async()=>{


        const response = await request(app)
        .post("/api/posts")
        .set(
            "Authorization",
            `Bearer ${token}`
        )

.send({
    title: "My First Test Post",
    description: "This is a test description",
    content: "Testing post creation"
});
console.log(response.body);


        expect(response.statusCode)
        .toBe(201);



        expect(response.body.success)
        .toBe(true);


        postId = response.body.post._id;


    });



    // GET ALL POSTS

    test("Get all posts", async()=>{


        const response = await request(app)
        .get("/api/posts");


        expect(response.statusCode)
        .toBe(200);



        expect(
            Array.isArray(response.body.posts)
        )
        .toBe(true);



    });



    // GET SINGLE POST

    test("Get single post", async()=>{


        const response = await request(app)
        .get(`/api/posts/${postId}`);



        expect(response.statusCode)
        .toBe(200);



        expect(response.body.post._id)
        .toBe(postId);



    });



    // UPDATE POST

    test("Update post", async()=>{


        const response = await request(app)
        .put(`/api/posts/${postId}`)
        .set(
            "Authorization",
            `Bearer ${token}`
        )
        .send({
    title: "Updated Post Title",
    description: "Updated description"
});
console.log(response.body);

        expect(response.statusCode)
        .toBe(200);



    });



    // UPDATE POST SECURITY
    test("Should not allow updating server-controlled fields", async()=>{

        const response = await request(app)
            .put(`/api/posts/${postId}`)
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                views: 999999,
                commentsCount: 999,
                bookmarksCount: 999
            });

        expect(response.statusCode)
            .toBe(200);

        const updatedPost =
            await Post.findById(postId);

        expect(updatedPost.views)
            .toBe(1);

        expect(updatedPost.commentsCount)
            .toBe(0);

        expect(updatedPost.bookmarksCount)
            .toBe(0);
    });

    // DELETE POST

    test("Delete post", async()=>{


        const response = await request(app)
        .delete(`/api/posts/${postId}`)
        .set(
            "Authorization",
            `Bearer ${token}`
        );



        expect(response.statusCode)
        .toBe(200);



    });
afterAll(async()=>{

    await mongoose.connection.dropDatabase();

    await mongoose.connection.close();

});


});
