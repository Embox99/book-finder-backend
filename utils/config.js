require("dotenv").config();

module.exports = {
  DATABASE_URL:
    process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/book-finder",
  JWT_SECRET: process.env.JWT_SECRET || "my-secret-key",
  PORT: process.env.PORT || 3001,
};
