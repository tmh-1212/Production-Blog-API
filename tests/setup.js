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