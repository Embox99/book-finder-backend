const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const { errorMessage } = require("../utils/errors");
const BadRequestError = require("../errors/badRequestError");
const NotFoundError = require("../errors/notFoundError");
const UnauthorizedError = require("../errors/unauthorizedError");
const ConflictError = require("../errors/conflictError");

const createUser = (req, res, next) => {
  const { name, yearOfBirth, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError(errorMessage.BAD_REQUEST));
  }

  if (!validator.isEmail(email)) {
    return next(new BadRequestError("Invalid Email"));
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError(errorMessage.CONFLICT_EMAIL);
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, yearOfBirth, email, password: hash }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        yearOfBirth: user.yearOfBirth,
        email: user.email,
      });
    })
    .catch((err) => {
      console.error(err);

      if (err instanceof ConflictError) {
        next(err);
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Validation failed"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  if (!validator.isEmail(email)) {
    throw new ConflictError(errorMessage.CONFLICT_EMAIL);
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "wrong email or password") {
        next(new UnauthorizedError("wrong email or password"));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessage.idNotFound);
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const updateCurrentProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new ConflictError(errorMessage.CONFLICT_EMAIL);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    res.send(updatedUser);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      next(new BadRequestError(errorMessage.BAD_REQUEST));
    } else if (err.name === "ValidationError") {
      next(new BadRequestError(errorMessage.BAD_REQUEST));
    } else {
      next(err);
    }
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentProfile,
};
