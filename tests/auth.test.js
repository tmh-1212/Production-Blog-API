// const request =
// require("supertest");


// const app =
// require("../app");

// jest.setTimeout(30000);

// describe(
// "Authentication API",
// ()=>{


// test(
// "Register user",
// async()=>{


// const response =
// await request(app)

// .post(
// "/api/auth/register"
// )

// .send({

// name:
// "Test User",

// email:
// "test@gmail.com",

// password:
// "password123"

// });


// expect(
// response.statusCode
// )
// .toBe(201);



// expect(
// response.body.success
// )
// .toBe(true);


// });

// test(
// "Login user",
// async()=>{


// const response =
// await request(app)

// .post(
// "/api/auth/login"
// )

// .send({

// email:
// "test@gmail.com",

// password:
// "password123"

// });



// expect(
// response.statusCode
// )
// .toBe(200);



// expect(response.body.token).toBeDefined();

// });

// });




//updete part 10 :
const request = require("supertest");

const app = require("../app");

jest.setTimeout(30000);
test(
"Login user",
async()=>{


// Create user first

await request(app)

.post("/api/auth/register")

.send({

name:"Test User",

email:"test@example.com",

password:"password123"

});



// Login

const response =
await request(app)

.post("/api/auth/login")

.send({

email:"test@example.com",

password:"password123"

});



expect(
response.statusCode
)
.toBe(200);



expect(
response.body.data.accessToken
)
.toBeDefined();


});