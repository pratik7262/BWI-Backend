const { body, validationResult } = require("express-validator");

const signUpRules = [
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Enter a password of minimum 8 characters").isLength({
    min: 8,
  }),
];

const signInRules = [body("password", "Enter A Password").exists()];

const handleErrors = (res, statusCode, message, success = false) => {
  return res.status(statusCode).json({ message, success });
};

function generateId() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  // Generate a random string (you can customize this part)
  const randomString = Math.random().toString(36).substring(2, 10);

  // Combine the components to create the final string
  const result = `${year}${month}${day}_${randomString}`;

  return result;
}

module.exports = {
  signUpRules,
  handleErrors,
  signInRules,
  generateId,
};
