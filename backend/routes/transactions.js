import express from "express";
import db from "../data/database.js";
import { authenticateToken, checkAccountOwnership } from "../middleware/auth.js";

const router = express.Router();

//Create new transaction
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

//Get Transaction by ID
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


//Get all Transactions for user
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
            accounts: accounts.map(a => a.account_id),
            transactions: allTransactions
        })
    }catch(error){
        console.error("Error fetching user transactions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;