// const express =
// require("express");


// const app =
// express();


// app.use(
// express.json()
// );



// const authRoutes =
// require("./routes/authRoutes");


// const userRoutes =
// require("./routes/userRoutes");


// const postRoutes =
// require("./routes/postRoutes");

// const swaggerUi =
// require(
// "swagger-ui-express"
// );


// const swaggerSpec =
// require(
// "./config/swagger"
// );


// app.use(
// "/api/auth",
// authRoutes
// );


// app.use(
// "/api/users",
// userRoutes
// );


// app.use(
// "/api/posts",
// postRoutes
// );





// app.use(

// "/api/docs",

// swaggerUi.serve,

// swaggerUi.setup(
// swaggerSpec
// )

// );


// module.exports =
// app;





//practice for each part
  // part 10:
  const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");


const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const healthRoutes = require("./routes/healthRoutes");
const emailRoutes = require("./routes/emailRoutes");
const sessionRoutes = require("./routes/sessionRoutes");


// Middleware
const errorHandler = require("./middleware/errorMiddleware");
const limiter = require("./middleware/rateLimiter");
const requestId = require("./middleware/requestId");
const mongoSanitize = require("./middleware/mongoSanitize");

const logger = require("./utils/logger");


const app = express();


// =====================
// Global Middleware
// =====================

app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? (process.env.CLIENT_URL || process.env.FRONTEND_URL)
        : true,
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));

app.use(mongoSanitize);


// Security

// app.use(helmet());


app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin"
        }
    })
);


// Logging

app.use(
    morgan(
        "combined",
        {
            stream:{
                write:(message)=>{
                    logger.info(message.trim());
                }
            }
        }
    )
);


// Rate Limit

app.use(limiter);


// Request ID

app.use(requestId);


// Static Files

app.use(
    "/uploads",
    express.static(
        path.join(__dirname,"uploads")
    )
);


// =====================
// Routes
// =====================

app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/users",
    userRoutes
);


app.use(
    "/api/admin",
    adminRoutes
);


app.use(
    "/api/posts",
    postRoutes
);


app.use(
    "/api/comments",
    commentRoutes
);


app.use(
    "/api",
    healthRoutes
);


app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec)
);


app.use(
"/api/auth",
emailRoutes
);

app.use("/api/sessions", sessionRoutes);


// Home Route

app.get("/",(req,res)=>{

    res.json({

        success:true,

        message:"Production Blog API Running 🚀"

    });

});


// 404 Catch-all Handler

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.originalUrl} not found`
    });
});


// Error Handler
// MUST be last

app.use(errorHandler);



module.exports = app;