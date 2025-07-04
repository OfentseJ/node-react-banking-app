import express from "express";
import db from "../data/database.js";
import {authenticateToken, checkAccountOwnership} from "../middleware/auth.js";

const router = express.Router();

//Get all accounts for a user
router.get("/", authenticateToken, async (req, res) => {
   try{
    const userAccounts = await db.getAccountsByUserId(req.user.userId);

    res.json({
        message: "Account retrieved successfully",
        accounts: userAccounts
    });
   }catch(error){
    console.error("Get accounts error:", error);
    res.status(500).json({error: "Internal server error"});
   }
});

//Create new account
router.post("/", authenticateToken, async (req, res) =>{
    try{
        const {account_type, initial_balance = 0} = req.body;

        if(!account_type){
            return res.status(400).json({error: "Account type is required"});
        }

        if(!["savings", "checking"].includes(account_type)){
            return res.status(400).json({error: "Invalid account type"});
        }

        const accountNumber = db.generateAccountNumber();

        const newAccount = {
            user_id: req.user.userId,
            account_number: accountNumber,
            account_type,
            balance: initial_balance,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        await db.createAccount(newAccount);

        res.status(201).json({
            message: "Account create successfully",
            account: newAccount
        });

    }catch(error){
        console.error("Create account error:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

//Get specific account
router.get("/:id", authenticateToken, checkAccountOwnership, async (req, res) => {
    try{

        res.json({
            message: "Account retrieved successfully",
            account: req.account
        })
    }catch(error){
        console.error("Get account error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Get account transactions
router.get("/:id/transactions", authenticateToken, checkAccountOwnership, async (req, res) => {

    const accountTransactions = await db.getTransactionsByAccountId(req.params.id);

    res.json({
        message: "Transactions retrieved successfully",
        transactions: accountTransactions
    })
});

export default router;