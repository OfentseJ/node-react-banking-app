import express from "express";
import db from "../data/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

//Create new transfer
router.post("/", authenticateToken, async (req, res) => {
    try{
        const { from_account_id, to_account_id, amount, description } = req.body;

        if(!from_account_id || !to_account_id || !amount){
            return res.status(400).json({ error: "Missing required fields"});
        }

        if(amount <= 0){
            return res.status(400).json({ error: "Amount must be more than 0"})
        }

        if(from_account_id === to_account_id){
            return res.status(400).json({error: "Cannot transfer to same account"})
        }

        const fromAccount = await db.getAccountById(from_account_id);
        const toAccount = await db.getAccountById(to_account_id);

        if (!fromAccount) {
        return res.status(404).json({ error: "Source account not found" });
        }

        if (!toAccount) {
        return res.status(404).json({ error: "Destination account not found" });
        }

        if (fromAccount.balance < amount) {
        return res.status(400).json({ error: "Insufficient funds" });
        }


        const newFromBalance = fromAccount.balance - amount;
        const newToBalance = toAccount.balance + amount;

        const referenceNumber = db.generateReferenceNumber(TRF);

        const newTransfer = {
            from_account_id,
            to_account_id,
            amount,
            transfer_date: new Date().toISOString(),
            status: "completed",
            reference_number: referenceNumber,
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString()
        }

        const debitTransaction = {
            account_id: from_account_id,
            amount,
            transaction_type: "debit",
            description: description || `Transfer to ${toAccount.account_number}`,
            transaction_date: new Date().toISOString(),
            running_balance: newFromBalance,
            status: "completed",
            reference_number: referenceNumber,
            created_at: new Date().toISOString()
        }

        const creditTransaction = {
            account_id: to_account_id,
            amount,
            transaction_type: "credit",
            description: description || `Transfer from ${fromAccount.account_number}`,
            transaction_date: new Date().toISOString(),
            running_balance: newToBalance,
            status: "completed",
            reference_number: referenceNumber,
            created_at: new Date().toISOString()
        }

        const updatedFromAccounts= {
            ...fromAccount,
            balance: newFromBalance
        };
        
        const updatedToAccount = {
            ...toAccount,
            balance: newToBalance
        }

        await db.createTransfer(newTransfer);
        await db.createTransaction(debitTransaction);
        await db.createTransaction(creditTransaction);
        await db.updateAccount(from_account_id, updatedFromAccounts);
        await db.updateAccount(to_account_id, updatedToAccount);

        res.status(201).json({
            message: "Transfer completed successfully",
            transfer: newTransfer,
            from_account_balance: newFromBalance,
            to_account_balance: newToBalance
        });
    }catch(error){
        console.error("Create transfer error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Get transfer history
router.get("/", authenticateToken, async (req, res) => {
   try{
        const userTransfers = await db.getTransfersByAccountId(req.user.userId);
        
        if(!userTransfers){
            return res.status(404).json({error: "Transfer not found"});
        }

        res.json({
            message: "Transfer retrieved successfully",
            userTransfers
        });
    }catch(error){
        console.error("Get transfer error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;