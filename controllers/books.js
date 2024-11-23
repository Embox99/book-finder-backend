const Book = require("../models/books");
const User = require("../models/users");
const BadRequestError = require("../errors/badRequestError");
const NotFoundError = require("../errors/notFoundError");
const ForbiddenError = require("../errors/forbiddenError");
const { errorMessage } = require("../utils/errors");

const addBook = async (bookData) => {
  const { bookId } = bookData;
  let book = await Book.findOne({ bookId });
  if (!book) {
    book = await Book.create(bookData);
  }
  return book;
};

const addFavoriteBook = async (req, res, next) => {
  try {
    const {
      bookId,
      title,
      author,
      description,
      publishedDate,
      coverImage,
      isbn,
    } = req.body;

    if (!bookId || !title || !author) {
      throw new BadRequestError(errorMessage.BAD_REQUEST);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    const book = await addBook({
      bookId,
      title,
      author,
      description,
      publishedDate,
      coverImage,
      isbn,
    });

    if (!user.favoriteBooks.includes(book._id)) {
      user.favoriteBooks.push(book._id);
      await user.save();
    }

    res.send(user);
  } catch (err) {
    console.error(err);
    next(
      err.name === "ValidationError"
        ? new BadRequestError(errorMessage.BAD_REQUEST)
        : err,
    );
  }
};

const addReadBook = async (req, res, next) => {
  try {
    const {
      bookId,
      title,
      author,
      description,
      publishedDate,
      coverImage,
      isbn,
    } = req.body;

    if (!bookId || !title || !author) {
      throw new BadRequestError(errorMessage.BAD_REQUEST);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    const book = await addBook({
      bookId,
      title,
      author,
      description,
      publishedDate,
      coverImage,
      isbn,
    });

    if (!user.readBooks.includes(book._id)) {
      user.readBooks.push(book._id);
      await user.save();
    }

    res.send(user);
  } catch (err) {
    console.error(err);
    next(
      err.name === "ValidationError"
        ? new BadRequestError(errorMessage.BAD_REQUEST)
        : err,
    );
  }
};

const removeFavoriteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    const book = await Book.findById(bookId);
    if (!book) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    if (book.owner.toString() !== req.user._id.toString()) {
      throw new ForbiddenError(errorMessage.FORBIDDEN);
    }

    user.favoriteBooks = user.favoriteBooks.filter(
      (id) => id.toString() !== bookId,
    );
    await user.save();

    const bookUsageCountInFavorites = await User.countDocuments({
      favoriteBooks: bookId,
    });
    const bookUsageCountInReadBooks = await User.countDocuments({
      readBooks: bookId,
    });

    if (bookUsageCountInFavorites === 0 && bookUsageCountInReadBooks === 0) {
      await Book.findByIdAndDelete(bookId);
    }

    res.send(user);
  } catch (err) {
    console.error(err);
    next(
      err.name === "CastError"
        ? new BadRequestError(errorMessage.BAD_REQUEST)
        : err,
    );
  }
};

const removeReadBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    const book = await Book.findById(bookId);
    if (!book) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }

    if (book.owner.toString() !== req.user._id.toString()) {
      throw new ForbiddenError(errorMessage.FORBIDDEN);
    }

    user.readBooks = user.readBooks.filter((id) => id.toString() !== bookId);
    await user.save();

    const bookUsageCountInFavorites = await User.countDocuments({
      favoriteBooks: bookId,
    });
    const bookUsageCountInReadBooks = await User.countDocuments({
      readBooks: bookId,
    });

    if (bookUsageCountInFavorites === 0 && bookUsageCountInReadBooks === 0) {
      await Book.findByIdAndDelete(bookId);
    }

    res.send(user);
  } catch (err) {
    console.error(err);
    next(
      err.name === "CastError"
        ? new BadRequestError(errorMessage.BAD_REQUEST)
        : err,
    );
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
