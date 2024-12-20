const router = require("express").Router();
const userRouter = require("./users");
const bookRouter = require("./books");
const { errorMessage } = require("../utils/errors");
const NotFoundError = require("../errors/notFoundError");
const { login, createUser } = require("../controllers/users");
const {
  validateLogin,
  validateCreateUser,
} = require("../middlewares/validation");

router.post("/signin", validateLogin, login);
router.post("/signup", validateCreateUser, createUser);

router.use("/users", userRouter);
router.use("/books", bookRouter);

router.use((req, res, next) =>
  next(new NotFoundError(errorMessage.NOT_FOUND))
);

module.exports = router;
