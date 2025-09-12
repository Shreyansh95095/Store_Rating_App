const express = require("express");
const authController = require('../controllers/auth.controller');
const { body } = require("express-validator");
const validationResult = require("../middlewares/validate.middleware");
const { authenticateToken } = require("../middlewares/auth.middleware");

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

const changePasswordValidationRules = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 6, max: 50 })
    .withMessage("New password must be between 6 and 50 characters")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,50}$/)
    .withMessage("New password must include at least 1 uppercase letter and 1 special character"),
];

const forgotPasswordValidationRules = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
];

const resetPasswordValidationRules = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required"),

  body("newPassword")
    .isLength({ min: 6, max: 50 })
    .withMessage("New password must be between 6 and 50 characters")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,50}$/)
    .withMessage("New password must include at least 1 uppercase letter and 1 special character"),
];


router.post("/register",
  registerValidationRules,
  validationResult,
  authController.registerUser
);
// router.post("/user/login", authController.loginUser);
router.post("/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);
router.get("/me", authController.me);
router.put("/change-password",
  authenticateToken,
  changePasswordValidationRules,
  validationResult,
  authController.changePassword
);

router.post("/forgot-password",
  forgotPasswordValidationRules,
  validationResult,
  authController.forgotPassword
);

router.post("/reset-password",
  resetPasswordValidationRules,
  validationResult,
  authController.resetPassword
);


module.exports = router;
