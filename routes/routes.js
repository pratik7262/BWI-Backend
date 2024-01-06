const express = require("express");
const router = express.Router();
const { signUpRules, signInRules } = require("../utils/routerUtils");
const upload = require("../middleware/upload");
const {
  signUp,
  signIn,
  fetchUser,
  changeInfo,
  deleteAccount,
} = require("../controllers/user");
const {
  createAdmin,
  getAllUsers,
  changeUserInfo,
  deleteUser,
} = require("../controllers/admin");
const getUserMiddleware = require("../middleware/fetchUser");

// User Routes
router.post("/user/create", upload.single("profileImg"), signUpRules, signUp);
router.post("/user/signin", signInRules, signIn);
router.get("/user/getuser", getUserMiddleware, fetchUser);
router.patch(
  "/user/changeinfo",
  getUserMiddleware,
  upload.single("profileImg"),
  changeInfo
);
router.delete("/user/deleteaccount", getUserMiddleware, deleteAccount);

// Admin Routes
router.post(
  "/admin/createadmin",
  upload.single("profileImg"),
  signUpRules,
  createAdmin
);
router.post("/admin/signin", signInRules, signIn);
router.get("/admin/getallusers", getUserMiddleware, getAllUsers);
router.patch(
  "/admin/changeuserinfo/:userId",
  getUserMiddleware,
  upload.single("profileImg"),
  changeUserInfo
);
router.delete("/admin/deleteuser/:userId", getUserMiddleware, deleteUser);

module.exports = router;
