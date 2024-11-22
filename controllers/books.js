const Book = require("../models/books");
const User = require("../models/users");
const BadRequestError = require("../errors/badRequestError");
const ForbiddenError = require("../errors/forbiddenError");
const NotFoundError = require("../errors/notFoundError");
const { errorMessage } = require("../utils/errors");

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

    let book = await Book.findOne({ bookId, owner: user._id });
    if (!book) {
      book = await Book.create({
        title,
        author,
        description,
        publishedDate,
        coverImage,
        isbn,
        bookId,
        owner: user._id,
      });
    }

    if (!user.favoriteBooks.includes(book._id)) {
      user.favoriteBooks.push(book._id);
      await user.save();
    }

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      favoriteBooks: user.favoriteBooks,
      readBooks: user.readBooks,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      next(new BadRequestError(errorMessage.BAD_REQUEST));
    } else {
      next(err);
    }
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

    let book = await Book.findOne({ bookId, owner: user._id });
    if (!book) {
      book = await Book.create({
        title,
        author,
        description,
        publishedDate,
        coverImage,
        isbn,
        bookId,
        owner: user._id,
      });
    }

    if (!user.readBooks.includes(book._id)) {
      user.readBooks.push(book._id);
      await user.save();
    }

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      favoriteBooks: user.favoriteBooks,
      readBooks: user.readBooks,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      next(new BadRequestError(errorMessage.BAD_REQUEST));
    } else {
      next(err);
    }
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

    await Book.findOneAndDelete({ _id: bookId, owner: user._id });

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      favoriteBooks: user.favoriteBooks,
      readBooks: user.readBooks,
    });
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

    await Book.findOneAndDelete({ _id: bookId, owner: user._id });

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      favoriteBooks: user.favoriteBooks,
      readBooks: user.readBooks,
    });
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
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }
    await user.populate("favoriteBooks").execPopulate();
    res.send({ favoriteBooks: user.favoriteBooks });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      next(new BadRequestError(errorMessage.BAD_REQUEST));
    } else {
      next(err);
    }
  }
};

const getUserReadBooks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(errorMessage.NOT_FOUND);
    }
    await user.populate("readBooks").execPopulate();
    res.send({ readBooks: user.readBooks });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      next(new BadRequestError(errorMessage.BAD_REQUEST));
    } else {
      next(err);
    }
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
