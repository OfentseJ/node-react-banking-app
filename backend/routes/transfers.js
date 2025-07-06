import express from "express";
import db from "../data/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

//Create new transfer
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { from_account_id, to_account_id, amount, description } = req.body;

    await db.performTransfer(
      from_account_id,
      to_account_id,
      amount,
      description
    );
    res.status(201).json({
      message: "Transfer completed successfully",
      transfer: newTransfer,
      from_account_balance: newFromBalance,
      to_account_balance: newToBalance,
    });
  } catch (error) {
    console.error("Create transfer error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get transfer history
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userTransfers = await db.getTransfersByAccountId(req.user.userId);

    if (!userTransfers) {
      return res.status(404).json({ error: "Transfer not found" });
    }

    res.json({
      message: "Transfer retrieved successfully",
      userTransfers,
    });
  } catch (error) {
    console.error("Get transfer error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
