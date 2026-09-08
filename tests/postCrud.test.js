const request = require("supertest");
const app = require("../app");

const mongoose = require("mongoose");


jest.setTimeout(30000);

require("dotenv").config({
    path:"tests/.env.test"
});

describe("Post CRUD API Tests", () => {

    let token;
    let postId;


    // Create user and get token before tests
    beforeAll(async()=>{

     

        const register = await request(app)
        .post("/api/auth/register")
        .send({
            name:"Post Tester",
            email:"post@test.com",
            password:"12345678"
        });


        const login = await request(app)
        .post("/api/auth/login")
        .send({
            email:"post@test.com",
            password:"12345678"
        });


        token = login.body.data.accessToken;

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