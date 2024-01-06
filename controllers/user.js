const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { handleErrors } = require("../utils/routerUtils.js");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");

//Sign Up Function Used To Create New User In SignUp End Point
const signUp = async (req, res) => {
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
        message: "This Phone Numer Is Already Used By Someone. Use Different.",
      });
    }

    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);

    const newUser = await User.create({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email,
      profileImg: req.file.path,
      phoneNumber: req.body.phoneNumber,
    });

    const authToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    // Use a consistent response format
    return res.json({
      token: authToken,
      success: true,
      message: "Account Created Successfully",
    });
  } catch (error) {
    // Add logging statements
    console.error("Error in signUp:", error.message);

    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

//Sign In Function Used In Login End Point
const signIn = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrors(res, 400, errors.array()[0].msg, false);
    }

    const { credential, password } = req.body;

    // Check if the credential is an email or a phone number
    const isEmail = credential.includes("@");
    const user = await User.findOne({
      $or: [
        { email: isEmail ? credential : null },
        { phoneNumber: isEmail ? null : credential },
      ],
    });

    if (!user) {
      return handleErrors(res, 400, "User Not Found.", false);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return handleErrors(res, 400, "Please enter valid credentials.", false);
    }

    const data = {
      user: {
        id: user._id,
      },
    };

    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    const createdUser = await User.findById(user._id).select("-password");
    // Use a consistent response format
    res.json({
      success: true,
      token: authToken,
      user: createdUser,
      message: "Logged In Successfully",
    });
  } catch (error) {
    // Add logging statements
    console.error("Error in signIn:", error.message);

    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

const changeInfo = async (req, res) => {
  try {
    const { id } = req.user;
    let data = {};
    if (req.body.name) {
      data.name = req.body.name;
    }
    if (req.file) {
      data.profileImg = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    }).select("-password");

    // Use a consistent response format
    res.json({
      success: true,
      data: updatedUser,
      message: "User information updated successfully",
    });
  } catch (error) {
    // Add logging statements
    console.error("Error in changeInfo:", error.message);

    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { id } = req.user;
    await User.findByIdAndDelete(id);

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

const fetchUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

module.exports = {
  signUp,
  signIn,
  fetchUser,
  changeInfo,
  deleteAccount,
};
