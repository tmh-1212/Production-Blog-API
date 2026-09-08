// const mongoose = require("mongoose");
// const {MongoMemoryServer} = require("mongodb-memory-server");


// let mongo;


// beforeAll(async()=>{

//     mongo = await MongoMemoryServer.create();

//     const uri = mongo.getUri();

//  console.log("Test Mongo URI:", uri);

//     await mongoose.connect(uri);

//  console.log("Mongo connected:", mongoose.connection.readyState);
// });


// afterEach(async()=>{

//     const collections =
//     mongoose.connection.collections;


//     for(let key in collections){

//         await collections[key].deleteMany({});

//     }

// });


// afterAll(async()=>{

//     await mongoose.connection.close();

//     await mongo.stop();

// });



// //part 10 :
// const mongoose = require("mongoose");
// const { MongoMemoryServer } = require("mongodb-memory-server");
// const connectDB = require("../config/db");

// let mongo;

// beforeAll(async () => {
//     mongo = await MongoMemoryServer.create();

//     await connectDB(mongo.getUri());
// });

// afterEach(async () => {
//     const collections = mongoose.connection.collections;

//     for (const key in collections) {
//         await collections[key].deleteMany({});
//     }
// });

// afterAll(async () => {
//     await mongoose.connection.close();
//     await mongo.stop();
// });




// //part 10 update:
// const mongoose = require("mongoose");
// const { MongoMemoryServer } = require("mongodb-memory-server");
// const connectDB = require("../config/db");

// let mongo;

// beforeAll(async () => {
//     mongo = await MongoMemoryServer.create();

//     const uri = mongo.getUri();

//     console.log("Test URI:", uri);

//     await connectDB(uri);

//     console.log("Connected:", mongoose.connection.readyState);
// });

// afterEach(async () => {
//     const collections = mongoose.connection.collections;

//     for (const key in collections) {
//         await collections[key].deleteMany({});
//     }
// });

// afterAll(async () => {
//     await mongoose.connection.close();
//     await mongo.stop();
// });




// ///part 10 update 2:
// const mongoose = require("mongoose");
// const { MongoMemoryServer } = require("mongodb-memory-server");
// const connectDB = require("../config/db");

// let mongo;

// beforeAll(async () => {

//     mongo = await MongoMemoryServer.create();

//     const uri = mongo.getUri();

//     console.log("TEST DATABASE:", uri);

//     await connectDB(uri);

//     console.log(
//         "Mongoose State:",
//         mongoose.connection.readyState
//     );

// });


// afterEach(async()=>{

//     const collections =
//     mongoose.connection.collections;


//     for(const key in collections){

//         await collections[key]
//         .deleteMany({});

//     }

// });


// afterAll(async()=>{

//     await mongoose.connection.dropDatabase();

//     await mongoose.connection.close();

//     await mongo.stop();

// });



// //updete part 10 :
// require("dotenv").config({
//     path:"tests/.env.test"
// });
// const mongoose = require("mongoose");
// const connectDB = require("../config/db");


// beforeAll(async()=>{

//     await connectDB(
//         process.env.MONGO_URI
//     );

// });


// afterEach(async()=>{

//     const collections =
//     mongoose.connection.collections;


//     for(const key in collections){

//         await collections[key].deleteMany({});

//     }

// });


// afterAll(async()=>{

//     await mongoose.connection.dropDatabase();

//     await mongoose.connection.close();

// });





require("dotenv").config({
    path:"tests/.env.test"
});

const mongoose = require("mongoose");
const connectDB = require("../config/db");

beforeAll(async()=>{

    if(mongoose.connection.readyState === 0){

        await connectDB(
            process.env.MONGO_URI
        );

    }

});


afterAll(async()=>{

    if(mongoose.connection.readyState === 1){

        await mongoose.connection.dropDatabase();

        await mongoose.connection.close();

    }

});