const Book = require("../models/books");
const User = require("../models/users");
const BadRequestError = require("../errors/badRequestError");
const NotFoundError = require("../errors/notFoundError");
const { errorMessage } = require("../utils/errors");

const addBook = async (bookData) => {
  try {
    const { id, etag, volumeInfo, owner } = bookData;

    const newBook = await Book.create({
      id,
      etag,
      volumeInfo,
      owner,
    });

    return newBook;
  } catch (err) {
    throw err;
  }
};

const addFavoriteBook = async (req, res, next) => {
  try {
    const { id, etag, volumeInfo } = req.body;
    if (
      !id ||
      !volumeInfo.title ||
      !Array.isArray(volumeInfo.authors) ||
      volumeInfo.authors.length === 0
    ) {
      throw new BadRequestError(errorMessage.BAD_REQUEST);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    let book = await Book.findOne({ id });

    if (!book) {
      book = await addBook({
        id,
        etag,
        volumeInfo,
        owner: req.user._id,
      });
    }

    if (!user.favoriteBooks.includes(book._id)) {
      user.favoriteBooks.push(book._id);
      await user.save();
    }

    res.send(user);
  } catch (err) {
    console.error("Error in addFavoriteBook:", err);
    next(
      err.name === "ValidationError"
        ? new BadRequestError(errorMessage.BAD_REQUEST)
        : err,
    );
  }
};

const addReadBook = async (req, res, next) => {
  try {
    const { id, etag, volumeInfo } = req.body;

    if (
      !id ||
      !volumeInfo.title ||
      !Array.isArray(volumeInfo.authors) ||
      volumeInfo.authors.length === 0
    ) {
      throw new BadRequestError(errorMessage.BAD_REQUEST);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    let book = await Book.findOne({ id });

    if (!book) {
      book = await addBook({
        id,
        etag,
        volumeInfo,
        owner: req.user._id,
      });
    }

    if (!user.readBooks.includes(book._id)) {
      user.readBooks.push(book._id);
      await user.save();
    }

    res.send(user);
  } catch (err) {
    console.error("Error in addReadBook:", err);
    next(
      err.name === "ValidationError"
        ? new BadRequestError(errorMessage.BAD_REQUEST)
        : err,
    );
  }
};

const removeFavoriteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    const book = await Book.findOne({ id });
    if (!book) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    if (!user.favoriteBooks.includes(book._id)) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    user.favoriteBooks = user.favoriteBooks.filter(
      (id) => id.toString() !== book._id.toString(),
    );
    await user.save();

    const bookUsageCountInFavorites = await User.countDocuments({
      favoriteBooks: book._id,
    });
    const bookUsageCountInReadBooks = await User.countDocuments({
      readBooks: book._id,
    });

    if (bookUsageCountInFavorites === 0 && bookUsageCountInReadBooks === 0) {
      await Book.findByIdAndDelete(book._id);
    }

    res.send(user);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      next(new BadRequestError(errorMessage.BAD_REQUEST));
    } else {
      next(err);
    }
  }
};

const removeReadBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    const book = await Book.findOne({ id });
    if (!book) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    if (!user.readBooks.includes(book._id)) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    user.readBooks = user.readBooks.filter(
      (id) => id.toString() !== book._id.toString(),
    );
    await user.save();

    const bookUsageCountInFavorites = await User.countDocuments({
      favoriteBooks: book._id,
    });
    const bookUsageCountInReadBooks = await User.countDocuments({
      readBooks: book._id,
    });

    if (bookUsageCountInFavorites === 0 && bookUsageCountInReadBooks === 0) {
      await Book.findByIdAndDelete(book._id);
    }

    res.send(user);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      next(new BadRequestError(errorMessage.BAD_REQUEST));
    } else {
      next(err);
    }
  }
};

const getUserFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("favoriteBooks");
    if (!user) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    res.send({ favoriteBooks: user.favoriteBooks });
  } catch (err) {
    console.error(err);
    next(
      err.name === "CastError"
        ? new BadRequestError(errorMessage.BAD_REQUEST)
        : err,
    );
  }
};

const getUserReadBooks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("readBooks");
    if (!user) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    res.send({ readBooks: user.readBooks });
  } catch (err) {
    console.error(err);
    next(
      err.name === "CastError"
        ? new BadRequestError(errorMessage.BAD_REQUEST)
        : err,
    );
  }
};

module.exports = {
  getUserReadBooks,
  getUserFavorites,
  removeReadBook,
  addReadBook,
  removeFavoriteBook,
  addFavoriteBook,
};
