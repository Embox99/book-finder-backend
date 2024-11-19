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
    return next(new BadRequestError("Email and password are required"));
  }

  if (!validator.isEmail(email)) {
    return next(new BadRequestError("Invalid Email"));
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError("Email is already used");
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
    throw new ConflictError("Email is already used");
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

const updateCurrentProfile = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new ConflictError("Email is already used");
      }
      return User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true, runValidators: true }
      );
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessage.idNotFound);
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError(errorMessage.badRequest));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError(errorMessage.badRequest));
      } else {
        next(err);
      }
    });
};

const addFavoriteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user.favoriteBooks.includes(bookId)) {
      user.favoriteBooks.push(bookId);
      await user.save();
    }
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      favoriteBooks: user.favoriteBooks,
      readBooks: user.readBooks,
    });
  } catch (error) {
    next(new BadRequestError("Error adding book to favorites"));
  }
};

const removeFavoriteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);
    user.favoriteBooks = user.favoriteBooks.filter(
      (id) => id.toString() !== bookId
    );
    await user.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      favoriteBooks: user.favoriteBooks,
      readBooks: user.readBooks,
    });
  } catch (error) {
    next(new BadRequestError("Error adding book to favorites"));
  }
};

const addReadBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user.readBooks.includes(bookId)) {
      user.readBooks.push(bookId);
      await user.save();
    }
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      favoriteBooks: user.favoriteBooks,
      readBooks: user.readBooks,
    });
  } catch (error) {
    next(new BadRequestError("Error adding book to favorites"));
  }
};

const removeReadBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);
    user.readBooks = user.readBooks.filter((id) => id.toString() !== bookId);
    await user.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      favoriteBooks: user.favoriteBooks,
      readBooks: user.readBooks,
    });
  } catch (error) {
    next(new BadRequestError("Error adding book to favorites"));
  }
};

const getUserFavorites = async (req, res, next) => {
  try {
    res.send({ favoriteBooks: req.user.favoriteBooks });
  } catch (error) {
    next(new BadRequestError("Error retrieving favorite books"));
  }
};

const getUserReadBooks = async (req, res, next) => {
  try {
    res.send({ readBooks: req.user.readBooks });
  } catch (error) {
    next(new BadRequestError("Error retrieving read books"));
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentProfile,
  addFavoriteBook,
  addReadBook,
  removeFavoriteBook,
  removeReadBook,
  getUserFavorites,
  getUserReadBooks,
};
