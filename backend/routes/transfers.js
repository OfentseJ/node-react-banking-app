import express from "express";
import db from "../data/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

//Create new transfer
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

//Get transfer history
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
