import express from "express";
import db from "../data/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * Name: Get User Beneficiaries
 * 
 * Description:
 * Retrieves all beneficiaries associated with the authenticated user.
 * Uses the user ID from the JWT token to fetch beneficiaries from the database.
 * Returns a list of beneficiaries with their details.
 * Expects a valid JWT token in the request header.
 */
router.get("/", authenticateToken, async (req, res) => {
    try{
        const list = await db.getBeneficiariesByUserId(req.user.userId);
        if (!list || list.length === 0) {
            return res.status(404).json({ error: "No beneficiaries found" });
        }
        res.json({beneficiaries: list});
    }catch (error) {
        console.error("Get beneficiaries error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Name: Add New Beneficiary
 * 
 * Description:
 * Adds a new beneficiary for the authenticated user.
 * Expects name, account_number, and account_type in the request body.
 * Validates the input fields and adds the beneficiary to the database.
 * Returns the newly created beneficiary details on success.
 * Expects a valid JWT token in the request header.
 */
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { nickname, account_number } = req.body;

        if (!nickname || !account_number ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newBeneficiary = await db.addBeneficiary(req.user.userId,{
            nickname,
            account_number
        });

        res.status(201).json({
            message: "Beneficiary added successfully",
            beneficiary: newBeneficiary
        });
    } catch (error) {
        console.error("Add beneficiary error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;