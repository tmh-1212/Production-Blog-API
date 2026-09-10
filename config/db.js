

   //updated part 10:
   const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async(uri=process.env.MONGO_URI)=>{

    if(mongoose.connection.readyState === 1){
        return;
    }


    const conn = await mongoose.connect(uri);


    logger.info(
        `MongoDB Connected: ${conn.connection.name}`
    );

};


module.exports = connectDB;