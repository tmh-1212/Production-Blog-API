// // const express = require("express");
// // const dotenv = require("dotenv");
// // const cors = require("cors");
// // const helmet = require("helmet");
// // const morgan = require("morgan");

// // const logger =
// // require("./utils/logger");

// // const userRoutes =
// // require("./routes/userRoutes");
// // const path = require("path");

// // const postRoutes =
// // require("./routes/postRoutes");


// // const commentRoutes =
// // require("./routes/commentRoutes");

// //  const adminRoutes =
// //  require("./routes/adminRoutes");

// // const xss =
// // require("xss-clean");



// // const authRoutes = require("./routes/authRoutes");
// // const adminRoutes =
// // require("./routes/adminRoutes");


// // const limiter =
// // require("./middleware/rateLimiter");

// // const mongoSanitize =
// // require(
// // "express-mongo-sanitize"
// // );

// // const requestId =
// // require("./middleware/requestId");

// // const healthRoutes =
// // require("./routes/healthRoutes");

// // const errorHandler = require("./middleware/errorMiddleware");

// //  const app =
// //  require("./app");


// // const connectDB = require("./config/db");


// // dotenv.config();


// // const app = express();


// // // Database

// // connectDB();


// // // Middleware

// // app.use(
// // cors({

// //     origin:
// //     process.env.CLIENT_URL,

// //     credentials:true

// // })
// // );

// // app.use(
// // limiter
// // );

// // app.use(express.json());

// // app.use(express.urlencoded({
// //     extended:true
// // }));


// // // Security

// // app.use(helmet());


// // // Logging

// // app.use(morgan("dev"));

// // app.use(

// // morgan(

// // "combined",

// // {

// // stream:{

// // write:(message)=>{

// // logger.info(
// // message.trim()
// // );

// // }

// // }

// // }

// // )

// // );


// // //routes

// // app.use("/api/auth",authRoutes);

// // app.use("/api/users",userRoutes);

// // app.use(
// // "/api/admin",
// // adminRoutes
// // );

// // app.use(
// // "/api/posts",
// // postRoutes
// // );




// // app.use(

// // "/api/comments",

// // commentRoutes

// // );


// // app.use(

// // "/api/admin",

// // adminRoutes

// // );

// // app.use(
// // mongoSanitize()
// // );


// // app.use(
// // xss()
// // );


// // app.use(
// // requestId
// // );




// // app.use(

// // "/api",

// // healthRoutes

// // );

// //  //Error Middleware
// //  app.use(errorHandler);




 

// // app.use(

// // "/uploads",

// // express.static(
// //     path.join(
// //         __dirname,
// //         "uploads"
// //     )
// // )

// // ); 
// // // Test Route

// // app.get("/",(req,res)=>{

// //     res.json({

// //         success:true,

// //         message:"Production Blog API Running 🚀"

// //     });

// // });


// // const PORT = process.env.PORT || 5000;


// // app.listen(PORT,()=>{

// //     console.log(
// //         `Server running on port ${PORT}`
// //     );

// // });





// //practice for each part.
//        //part 1:
// // const express = require("express");
// // const dotenv = require("dotenv");
// // const cors = require("cors");

// // const helmet = require("helmet");

// // const morgan = require("morgan");

// // const authRoutes =
// // require("./routes/authRoutes");

// // const errorHandler =
// // require("./middleware/errorMiddleware");

// // const connectDB = require("./config/db");


// // dotenv.config();


// // const app = express();


// // // Database

// // connectDB();


// // // Middleware

// // app.use(cors());

// // app.use(express.json());

// // app.use(express.urlencoded({
// //     extended:true
// // }));


// // // Security

// // app.use(helmet());


// // // Logging

// // app.use(morgan("dev"));

// // app.use(
// // "/api/auth",
// // authRoutes
// // );


// // app.use(errorHandler);



// // // Test Route

// // app.get("/",(req,res)=>{

// //     res.json({

// //         success:true,

// //         message:"Production Blog API Running 🚀"

// //     });

// // });



// // const PORT = process.env.PORT || 5000;


// // app.listen(PORT,()=>{

// //     console.log(
// //         `Server running on port ${PORT}`
// //     );

// // });


// //         //part 3 :

// //  const express = require("express");
// // const dotenv = require("dotenv");
// // const cors = require("cors");

// // const helmet = require("helmet");

// // const morgan = require("morgan");

// // const authRoutes =
// // require("./routes/authRoutes");

// // const errorHandler =
// // require("./middleware/errorMiddleware");

// // const userRoutes =
// // require("./routes/userRoutes");

// // const adminRoutes =
// // require("./routes/adminRoutes");

// // const path =
// // require("path");

// // const postRoutes =
// // require("./routes/postRoutes");

// // const commentRoutes =
// // require("./routes/commentRoutes");

// // const limiter =
// // require("./middleware/rateLimiter");


// // // const mongoSanitize =
// // // require(
// // // "express-mongo-sanitize"
// // // );


// // const sanitize = require("./middleware/mongoSanitize");


// // // const xss =
// // // require("xss-clean");


// // const logger =
// // require("./utils/logger");

// // const requestId =
// // require("./middleware/requestId");

// // const healthRoutes =
// // require("./routes/healthRoutes");

// // // const app =
// // // require("./app");

// // const connectDB = require("./config/db");


// // dotenv.config();


// // const app = express();


// // // Database

// // connectDB();


// // // Middleware




// // // Security

// // app.use(helmet());

// // app.use(cors());

// // app.use(express.json());

// // app.use(express.urlencoded({
// //     extended:true
// // }));


// // // Logging

// // //app.use(morgan("dev"));

// // app.use(

// // morgan(

// // "combined",

// // {

// // stream:{

// // write:(message)=>{

// // logger.info(
// // message.trim()
// // );
// // }

// // }

// // }

// // ));

// // app.use(
// // "/api/auth",
// // authRoutes
// // );


// // app.use(
// // "/api/users",
// // userRoutes
// // );


// // app.use(
// // "/api/admin",
// // adminRoutes
// // );




// // app.use(

// // "/uploads",

// // express.static(
// //     path.join(
// //         __dirname,
// //         "uploads"
// //     )
// // )

// // );



// // app.use(
// // "/api/posts",
// // postRoutes
// // );


// // app.use(

// // "/api/comments",

// // commentRoutes

// // );


// // // Rate limit
// // app.use(limiter);

// // // app.use(
// // // mongoSanitize()
// // // );


// // // Custom sanitization
// // app.use(sanitize);



// // // app.use(
// // // xss()
// // // );

// // app.use(
// // requestId
// // );


// // app.use(

// // "/api",

// // healthRoutes

// // );

// // app.use(errorHandler);

// // // Test Route

// // app.get("/",(req,res)=>{

// //     res.json({

// //         success:true,

// //         message:"Production Blog API Running 🚀"

// //     });

// // });



// // const PORT = process.env.PORT || 5000;


// // app.listen(PORT,()=>{

// //     console.log(
// //         `Server running on port ${PORT}`
// //     );

// // });



// //prt 10:
// const dotenv = require("dotenv");

// const connectDB = require("./config/db");

// const app = require("./app");


// dotenv.config();


// // Database

// connectDB();



// const PORT = process.env.PORT || 5000;



// app.listen(PORT,()=>{

//     console.log(
//         `Server running on port ${PORT}`
//     );

// });



//updet part 10 : 
const dotenv = require("dotenv");
const validateEnv = require("./config/envCheck");

dotenv.config();
validateEnv();

const connectDB = require("./config/db");
const app = require("./app");
const mongoose = require("mongoose");
const logger = require("./utils/logger");

const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
        console.log(`\n${signal} received. Closing server gracefully...`);
        server.close(async () => {
            await mongoose.connection.close();
            console.log("MongoDB connection closed. Process terminated.");
            process.exit(0);
        });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    process.on("unhandledRejection", (reason, promise) => {
        if (logger && logger.error) {
            logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
        } else {
            console.error("Unhandled Rejection:", reason);
        }
    });

    process.on("uncaughtException", (error) => {
        if (logger && logger.error) {
            logger.error(`Uncaught Exception: ${error.message}`);
        } else {
            console.error("Uncaught Exception:", error);
        }
        process.exit(1);
    });
};

startServer();