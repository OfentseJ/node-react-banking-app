import express from "express";
import db from "../data/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * Name: Create New Transfer
 * 
 * Description:
 * Handles the transfer of funds between two accounts.
 * Expects from_account_id, to_account_id, amount, and an optional description in the request body.
 * Validates the accounts, checks if the amount is positive, and ensures sufficient funds are available.
 * Performs the transfer, updates both accounts, and returns the transfer details on success.
 * Expects a valid JWT token in the request header.
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { from_account_id, to_account_id, amount, description } = req.body;

    const { transfer } = await db.performTransfer(
      from_account_id,
      to_account_id,
      amount,
      description
    );

    res.status(201).json({
      message: "Transfer completed successfully",
      transfer: transfer
    });
  } catch (error) {
    console.error("Create transfer error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Name: Get User Transfer History
 * 
 * Description:
 * Retrieves all transfers associated with the authenticated user's accounts.
 * Uses the user ID from the JWT token to fetch accounts,
 * then retrieves transfers for each account.
 * Returns a list of transfers across all accounts.
 * Expects a valid JWT token in the request header.
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const accounts = await db.getAccountsByUserId(req.user.userId);
    const transfers = [];

    for (const acc of accounts) {
      const tx = await db.getTransfersByAccountId(acc.account_id);
      transfers.push(...tx);
    }

    if (!transfers) {
      return res.status(404).json({ error: "Transfer not found" });
    }

    res.json({
      message: "Transfer retrieved successfully",
      transfers,
    });
  } catch (error) {
    console.error("Get transfer error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
