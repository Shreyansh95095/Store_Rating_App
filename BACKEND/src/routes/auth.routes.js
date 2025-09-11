const express = require("express");
const authController = require('../controllers/auth.controller');
const { body } = require("express-validator");
const validationResult = require("../middlewares/validate.middleware");

const router = express.Router();

const registerValidationRules = [
  body("fullName")
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),

  body("address")
    .isLength({ max: 400 })
    .withMessage("Address must be maximum 400 characters"),

  body("email")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)
    .withMessage("Password must be 8-16 chars, include 1 uppercase and 1 special character"),
  body("role")
    .optional()
    .isIn(["Admin", "Normal User", "Owner"])
    .withMessage("Invalid role"),
];

// router.post("/user/register",
//   registerValidationRules,
//   validationResult,
//   authController.registerUser
// );
router.post("/register",
  registerValidationRules,
  validationResult,
  authController.registerUser
);
// router.post("/user/login", authController.loginUser);
router.post("/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);
router.get("/me", authController.me);


module.exports = router;
