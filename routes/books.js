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
const {
  validateBookAction,
  validateBookId,
} = require("../middlewares/validation");

router.use(auth);
router.get("/me/favorite", getUserFavorites);
router.get("/me/read", getUserReadBooks);
router.post("/me/favorite", validateBookAction, addFavoriteBook);
router.delete("/me/favorite/:id", validateBookId, removeFavoriteBook);
router.post("/me/read", validateBookAction, addReadBook);
router.delete("/me/read/:id", validateBookId, removeReadBook);

module.exports = router;
