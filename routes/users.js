const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  addReadBook,
  addFavoriteBook,
  removeFavoriteBook,
  removeReadBook,
  getUserFavorites,
  getUserReadBooks,
  getCurrentUser,
  updateCurrentProfile,
} = require("../controllers/users");
const {
  validateProfileUpdate,
  validateUserId,
} = require("../middlewares/validation");

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", validateProfileUpdate, updateCurrentProfile);
router.get("/me/favorite", validateUserId, getUserFavorites);
router.get("/me/read", validateUserId, getUserReadBooks);
router.post("/me/favorite/:bookId", validateUserId, addFavoriteBook);
router.delete("/me/favorite/:bookId", validateUserId, removeFavoriteBook);
router.post("/me/read/:bookId", validateUserId, addReadBook);
router.delete("/me/read/:bookId", validateUserId, removeReadBook);

module.exports = router;
