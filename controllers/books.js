const Book = require("../models/book");
const BadRequestError = require("../errors/badRequestError");

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

    let book = await Book.findOne({ bookId });
    if (!book) {
      book = await Book.create({
        title,
        author,
        description,
        publishedDate,
        coverImage,
        isbn,
        bookId,
      });
    }

    const user = req.user;
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
  } catch (error) {
    next(new BadRequestError("Error adding book to favorites"));
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

    let book = await Book.findOne({ bookId });
    if (!book) {
      book = await Book.create({
        title,
        author,
        description,
        publishedDate,
        coverImage,
        isbn,
        bookId,
      });
    }

    const user = req.user;
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
  } catch (error) {
    next(new BadRequestError("Error adding book to read list"));
  }
};

const removeFavoriteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = req.user;
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
    next(new BadRequestError("Error removing book from favorites"));
  }
};

const removeReadBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = req.user;
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
    next(new BadRequestError("Error removing book from read list"));
  }
};

const getUserFavorites = async (req, res, next) => {
  try {
    const user = req.user;
    await user.populate("favoriteBooks").execPopulate();
    res.send({ favoriteBooks: user.favoriteBooks });
  } catch (error) {
    next(new BadRequestError("Error retrieving favorite books"));
  }
};

const getUserReadBooks = async (req, res, next) => {
  try {
    const user = req.user;
    await user.populate("readBooks").execPopulate();
    res.send({ readBooks: user.readBooks });
  } catch (error) {
    next(new BadRequestError("Error retrieving read books"));
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
