const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
const limiter = require("./utils/rateLimitConfig");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { errorLogger, requestLogger } = require("./middlewares/logger");
const config = require("./utils/config");

const app = express();

const { PORT, DATABASE_URL } = config;

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log("Conected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use("/", mainRouter);
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
