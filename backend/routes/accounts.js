import express from "express";
import db from "../data/database.js";
import {
  authenticateToken,
  checkAccountOwnership,
} from "../middleware/auth.js";

const router = express.Router();

/**
 * Name: Get User Accounts
 * 
 * Description:
 * Retrieves all accounts associated with the authenticated user.
 * Uses the user ID from the JWT token to fetch accounts from the database.
 * Returns a list of accounts with their details.
 * Expects a valid JWT token in the request header.
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userAccounts = await db.getAccountsByUserId(req.user.userId);

    res.json({
      message: "Account retrieved successfully",
      accounts: userAccounts,
    });
  } catch (error) {
    console.error("Get accounts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Name: Create New Account
 * 
 * Description:
 * Creates a new account for the authenticated user.
 * Expects account_type and initial_balance in the request body.
 * Validates the account type and initializes the account with the provided balance.
 * Returns the newly created account details on success.
 * Expects a valid JWT token in the request header.
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { account_type, initial_balance = 0 } = req.body;

    if (!account_type) {
      return res.status(400).json({ error: "Account type is required" });
    }

    if (!["savings", "checking"].includes(account_type)) {
      return res.status(400).json({ error: "Invalid account type" });
    }

    const accountNumber = db.generateAccountNumber();

    const newAccount = {
      user_id: req.user.userId,
      account_number: accountNumber,
      account_type,
      balance: initial_balance,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db.createAccount(newAccount);

    res.status(201).json({
      message: "Account create successfully",
      account: newAccount,
    });
  } catch (error) {
    console.error("Create account error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Name: Get Account Details
 * 
 * Description:
 * Retrieves details of a specific account by its ID.
 * Uses the account ID from the request parameters.
 * Checks if the authenticated user owns the account.
 * Returns the account details on success.
 */
router.get(
  "/:id",
  authenticateToken,
  checkAccountOwnership,
  async (req, res) => {
    try {
      res.json({
        message: "Account retrieved successfully",
        account: req.account,
      });
    } catch (error) {
      console.error("Get account error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * Name: Update Account
 * 
 * Description:
 * Updates the details of a specific account.
 * Expects account_type and balance in the request body.
 * Validates the account type and updates the account details.
 * Returns the updated account details on success.
 * Checks if the authenticated user owns the account.
 * Expects a valid JWT token in the request header.
 */
router.get(
  "/:id/transactions",
  authenticateToken,
  checkAccountOwnership,
  async (req, res) => {
    const accountTransactions = await db.getTransactionsByAccountId(
      req.params.id
    );

    res.json({
      message: "Transactions retrieved successfully",
      transactions: accountTransactions,
    });
  }
);

export default router;
