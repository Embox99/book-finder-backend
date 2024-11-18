require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";

module.exports = {
  JWT_SECRET,
};
