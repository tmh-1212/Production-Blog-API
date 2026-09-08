// const mongoose = require("mongoose");

// const connectDB = async()=>{
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI); 
//     console.log(`MongoDB Connected : ${conn.connection.host}`);
// }
//  catch(error){

//         console.log(
//             "Database Connection Error:",
//             error.message
//         );

//         process.exit(1);

//     }
// };

// module.exports = connectDB;



//practice for each part
//      //part 10:
// const mongoose = require("mongoose");

// const connectDB = async (uri = process.env.MONGO_URI) => {
//     try {
//         const conn = await mongoose.connect(uri);

//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error("Database Connection Error:", error.message);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;


// //part 10 update:
// const mongoose = require("mongoose");

// const connectDB = async (uri = process.env.MONGO_URI) => {
//     const conn = await mongoose.connect(uri);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
// };

// module.exports = connectDB;


   //updated part 10:
   const mongoose = require("mongoose");


const connectDB = async(uri=process.env.MONGO_URI)=>{

    if(mongoose.connection.readyState === 1){
        return;
    }


    const conn = await mongoose.connect(uri);


    console.log(
        `MongoDB Connected: ${conn.connection.name}`
    );

};


module.exports = connectDB;