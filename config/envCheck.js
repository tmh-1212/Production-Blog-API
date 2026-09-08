const requiredEnvVars = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "REFRESH_TOKEN_SECRET"
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ CRITICAL: Missing mandatory environment variables:");
    missing.forEach((key) => console.error(`   - ${key}`));
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      console.warn("⚠️ Warning: Running in non-production mode with missing env variables.");
    }
  } else {
    console.log("✅ Environment variables validated successfully.");
  }
};

module.exports = validateEnv;
