const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  addReadBook,
  addFavoriteBook,
  removeFavoriteBook,
  removeReadBook,
  getUserFavorites,
  getUserReadBooks,
} = require("../controllers/books");

const { validateUserId } = require("../middlewares/validation");

router.use(auth);
router.get("/me/favorite", validateUserId, getUserFavorites);
router.get("/me/read", validateUserId, getUserReadBooks);
router.post("/me/favorite", validateUserId, addFavoriteBook);
router.delete("/me/favorite/:bookId", validateUserId, removeFavoriteBook);
router.post("/me/read", validateUserId, addReadBook);
router.delete("/me/read/:bookId", validateUserId, removeReadBook);

module.exports = router;
