import express from "express";
import db from "../data/database.js";
import { authenticateToken, checkAccountOwnership } from "../middleware/auth.js";

const router = express.Router();

/**
 * Name: Create New Transaction
 * 
 * Description:
 * Creates a new transaction for the authenticated user's account.
 * Expects amount, transaction_type (debit/credit), and an optional description in the
 * request body.
 * Validates the transaction type, checks if the amount is positive,
 * and ensures sufficient funds are available.
 * Generates a reference number, updates the account balance,
 * and saves the transaction to the database.
 * Returns the created transaction and new balance on success.
 * Expects a valid JWT token in the request header.
 */
router.post("/", authenticateToken, async (req, res) => {
    try{
        const {amount, transaction_type, description} = req.body;

        if(!amount || !transaction_type){
            return res.status(400).json({error: "Missing required fields"});
        }

        if(!["debit", "credit"].includes(transaction_type)){
            return res.status(400).json({error: "Invalid transaction type"});
        }
        
        if(amount <= 0){
            return res.status(400).json({ error: "Amount must be positive" });
        }

        let newBalance;
        if(transaction_type === "credit"){
            newBalance = req.account.balance + amount;
        }else{
            newBalance = req.account.balance - amount;
        }

        if(newBalance < 0){
            return res.status(400).json({ error: "Insufficient funds" });
        }

        const referenceNumber = db.generateReferenceNumber();

        const newTransaction = {
            account_id: req.account.account_id,
            amount,
            transaction_type,
            description: description || `${transaction_type} transaction`,
            transaction_date: new Date().toISOString(),
            running_balance: newBalance,
            status: "completed",
            reference_number: referenceNumber,
        }

        const updatedAccount = {
            ...req.account,
            balance: newBalance,
            updatedAccount: new Date().toISOString()
        };

        await db.createTransaction(newTransaction);
        await db.updateAccount(req.account.account_id, updatedAccount);

        res.status(201).json({
        message: "Transaction created successfully",
        transaction: newTransaction,
        new_balance: newBalance
        });

    } catch (error) {
        console.error("Create transaction error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Name: Get Transaction by ID
 * 
 * Description:
 * Retrieves a specific transaction by its ID.
 * Uses the transaction ID from the request parameters.
 * Checks if the transaction exists in the database.
 * Returns the transaction details on success.
 * Expects a valid JWT token in the request header.
 */
router.get("/:id", async (req, res) => {
    try {
        const transaction = await db.getTransactionById(req.params.id);
        
        if(!transaction){
            return res.status(404).json({error: "Transaction not found "});
        }

        res.json({
            message: "Transaction retrieved successfully",
            transaction
        });
    }catch(error){
        console.error("Get transaction error:", error);
        res.status(500).json({error: "Internal server error"})
    }
});


/**
 * Name: Get User Transactions
 * 
 * Description:
 * Retrieves all transactions associated with the authenticated user's accounts.  
 * Uses the user ID from the JWT token to fetch accounts,
 * then retrieves transactions for each account.
 * Returns a list of transactions across all accounts.
 * Expects a valid JWT token in the request header.
 */
router.get("/", authenticateToken, async (req, res) => {
    try{
        const userAccounts = await db.getAccountsByUserId(req.user.userId);
        if (!userAccounts || userAccounts.length === 0) {
            return res.status(404).json({ error: "No accounts found for user" });
        }

        const allTransactions = [];
        
        for(const account of userAccounts){
            const transactions = await db.getTransactionsByAccountId(account.account_id)
            allTransactions.push(...transactions);
        }

        res.json({
            message: "User Transactions retrieved successfully",
            accounts: userAccounts.map(a => a.account_id),
            transactions: allTransactions
        })
    }catch(error){
        console.error("Error fetching user transactions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;