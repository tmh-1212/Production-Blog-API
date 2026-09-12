
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
        logger.info(`Server running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
        logger.info(`\n${signal} received. Closing server gracefully...`);
        server.close(async () => {
            await mongoose.connection.close();
            logger.info("MongoDB connection closed. Process terminated.");
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