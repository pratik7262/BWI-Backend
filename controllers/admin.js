const { validationResult } = require("express-validator");
const User = require("../models/User");
const { handleErrors } = require("../utils/routerUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrors(res, 400, errors.array()[0].msg, false);
    }

    const [existingUser, phoneNumberUsed] = await Promise.all([
      User.findOne({ email: req.body.email }),
      User.findOne({ phoneNumber: req.body.phoneNumber }),
    ]);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User with this email already exists. Please enter a unique email.",
      });
    }

    if (phoneNumberUsed) {
      return res.status(400).json({
        success: false,
        message: "This Phone Numer Is Already Used By Someone Use Different",
      });
    }

    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);

    const newUser = await User.create({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email,
      profileImg: req.file ? req.file.path : null,
      phoneNumber: req.body.phoneNumber,
      isAdmin: true,
    });

    const authToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
    return res.json({
      token: authToken,
      success: true,
      message: "Account Created Successfully",
    });
  } catch (error) {
    console.error("Error in createadmin:", error.message);
    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { id } = req.user;
    const admin = await User.findById(id);

    // Simplify admin check
    if (!admin || !admin.isAdmin) {
      return handleErrors(
        res,
        403, // 403 Forbidden status code for unauthorized access
        "You Cannot Access This Data. You Are Not Admin",
        false
      );
    }

    const users = await User.find({ isAdmin: false }).select("-password");

    // Use a consistent response format
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    // Add logging statements
    console.error("Error in getAllUsers:", error.message);

    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

const changeUserInfo = async (req, res) => {
  try {
    const { id } = req.user;

    // Simplify admin check
    const admin = await User.findById(id);
    if (!admin || !admin.isAdmin) {
      return handleErrors(
        res,
        403, // 403 Forbidden status code for unauthorized access
        "You Cannot Access This Data. You Are Not Admin",
        false
      );
    }

    const userId = req.params.userId;

    let data = {};
    if (req.body.name) {
      data.name = req.body.name;
    }
    if (req.file) {
      data.profileImg = req.file.path;
    }

    // Use findByIdAndUpdate with { new: true } to get the updated user
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
    }).select("-password");

    // Use a consistent response format
    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    // Add logging statements
    console.error("Error in changeUserInfo:", error.message);

    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.user;

    // Simplify admin check
    const admin = await User.findById(id);
    if (!admin || !admin.isAdmin) {
      return handleErrors(
        res,
        403, // 403 Forbidden status code for unauthorized access
        "You Cannot Delete User. You Are Not Admin",
        false
      );
    }

    const userId = req.params.userId;

    // Use findByIdAndDelete
    await User.findByIdAndDelete(userId);

    // Use a consistent response format
    res.json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    // Add logging statements
    console.error("Error in deleteUser:", error.message);

    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

module.exports = {
  createAdmin,
  getAllUsers,
  changeUserInfo,
  deleteUser,
};
