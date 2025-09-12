const express = require("express");
const { body } = require("express-validator");
const {
    getStoreProfile,
    createOrUpdateStoreProfile,
    deleteStoreProfile,
    getAllStores
} = require("../controllers/store.controller");
const { authenticateToken, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

// Validation middleware for store profile
const storeValidation = [
    body("storeName")
        .notEmpty()
        .withMessage("Store name is required")
        .isLength({ min: 1, max: 100 })
        .withMessage("Store name must be between 1 and 100 characters"),

    body("ownerName")
        .notEmpty()
        .withMessage("Owner name is required")
        .isLength({ min: 1, max: 100 })
        .withMessage("Owner name must be between 1 and 100 characters"),

    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .isLength({ min: 5, max: 20 })
        .withMessage("Phone number must be between 5 and 20 characters"),

    body("address")
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ min: 5, max: 500 })
        .withMessage("Address must be between 5 and 500 characters"),

    body("description")
        .optional()
        .isLength({ max: 1000 })
        .withMessage("Description must not exceed 1000 characters"),

    body("establishedYear")
        .optional()
        .custom((value) => {
            if (value === "" || value === null || value === undefined) {
                return true; // Allow empty values
            }
            const year = parseInt(value);
            if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
                throw new Error("Please provide a valid establishment year between 1900 and current year");
            }
            return true;
        }),

    body("website")
        .optional()
        .custom((value) => {
            if (value === "" || value === null || value === undefined) {
                return true; // Allow empty values
            }
            // More lenient URL validation
            if (value.length > 0 && !value.includes('.')) {
                throw new Error("Please provide a valid website URL");
            }
            return true;
        })
];

// Test endpoint for debugging (remove in production)
router.post("/test-validation", storeValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
    }
    res.json({ success: true, message: "Validation passed", data: req.body });
});

// Routes (protected - owner only)
router.get("/profile", authenticateToken, authorizeRoles("Owner"), getStoreProfile);
router.post("/profile", authenticateToken, authorizeRoles("Owner"), storeValidation, createOrUpdateStoreProfile);
router.put("/profile", authenticateToken, authorizeRoles("Owner"), storeValidation, createOrUpdateStoreProfile);
router.delete("/profile", authenticateToken, authorizeRoles("Owner"), deleteStoreProfile);

// Admin routes
router.get("/all", authenticateToken, authorizeRoles("Admin"), getAllStores);

module.exports = router;
