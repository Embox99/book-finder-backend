const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getCurrentUser,
  updateCurrentProfile,
  getGoal,
  setGoal,
} = require("../controllers/users");
const {
  validateProfileUpdate,
  validateGoal,
} = require("../middlewares/validation");

router.use(auth);
router.get("/me/goal", getGoal);
router.patch("/me/goal", validateGoal, setGoal);
router.get("/me", getCurrentUser);
router.patch("/me", validateProfileUpdate, updateCurrentProfile);

module.exports = router;
