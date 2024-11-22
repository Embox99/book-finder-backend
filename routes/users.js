const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getCurrentUser,
  updateCurrentProfile,
} = require("../controllers/users");
const { validateProfileUpdate } = require("../middlewares/validation");

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", validateProfileUpdate, updateCurrentProfile);

module.exports = router;
