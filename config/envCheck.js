const logger = require("../utils/logger");
const requiredEnvVars = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "REFRESH_TOKEN_SECRET"
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    logger.error("CRITICAL: Missing mandatory environment variables:");
    missing.forEach((key) => logger.error(`   - ${key}`));
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      logger.warn("Warning: Running in non-production mode with missing env variables.");
    }
  } else {
    logger.info("Environment variables validated successfully.");
  }
};

module.exports = validateEnv;
