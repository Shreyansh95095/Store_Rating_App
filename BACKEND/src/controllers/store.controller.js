const { query } = require("../db/db");
const { validationResult } = require("express-validator");

// Get store profile by owner ID
const getStoreProfile = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const [rows] = await query(
            "SELECT * FROM stores WHERE ownerId = ?",
            [ownerId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store profile not found"
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("Error fetching store profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Create or update store profile
const createOrUpdateStoreProfile = async (req, res) => {
    try {
        console.log("Received data:", req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation errors:", errors.array());
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
        }

        const ownerId = req.user.id;
        const {
            storeName,
            ownerName,
            email,
            phone,
            address,
            description,
            establishedYear,
            website
        } = req.body;

        // Check if store profile already exists
        const [existingStore] = await query(
            "SELECT id FROM stores WHERE ownerId = ?",
            [ownerId]
        );

        if (existingStore.length > 0) {
            // Update existing store
            await query(
                `UPDATE stores SET 
                    storeName = ?, 
                    ownerName = ?, 
                    email = ?, 
                    phone = ?, 
                    address = ?, 
                    description = ?, 
                    establishedYear = ?, 
                    website = ?,
                    updatedAt = NOW()
                WHERE ownerId = ?`,
                [
                    storeName,
                    ownerName,
                    email,
                    phone,
                    address,
                    description,
                    establishedYear,
                    website,
                    ownerId
                ]
            );

            res.status(200).json({
                success: true,
                message: "Store profile updated successfully"
            });
        } else {
            // Create new store profile
            await query(
                `INSERT INTO stores (
                    storeName, 
                    ownerName, 
                    email, 
                    phone, 
                    address, 
                    description, 
                    establishedYear, 
                    website, 
                    ownerId
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    storeName,
                    ownerName,
                    email,
                    phone,
                    address,
                    description,
                    establishedYear,
                    website,
                    ownerId
                ]
            );

            res.status(201).json({
                success: true,
                message: "Store profile created successfully"
            });
        }
    } catch (error) {
        console.error("Error creating/updating store profile:", error);

        // Handle duplicate email error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete store profile
const deleteStoreProfile = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const [result] = await query(
            "DELETE FROM stores WHERE ownerId = ?",
            [ownerId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Store profile not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Store profile deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting store profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get all stores (for admin purposes)
const getAllStores = async (req, res) => {
    try {
        const [rows] = await query(
            "SELECT s.*, u.fullName as userFullName FROM stores s JOIN users u ON s.ownerId = u.id"
        );

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("Error fetching all stores:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    getStoreProfile,
    createOrUpdateStoreProfile,
    deleteStoreProfile,
    getAllStores
};
