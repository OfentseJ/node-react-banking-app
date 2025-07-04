import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./data/database.js";
import userRoutes from "./routes/users.js";
import accountRoutes from "./routes/accounts.js";
import transactionRoutes from "./routes/transactions.js";
//import transferRoutes from "./routes/transfers.js";

dotenv.config();

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Bank App API is running",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      accounts: "/api/accounts",
      transactions: "/api/transactions",
      transfers: "/api/transfers",
    },
  });
});

app.get("/api/test", async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json({
      message: "Database connected successfully!",
      userCount: users.users.length,
    });
  } catch (error) {
    console.error("Database test error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
//app.use("/api/transfers", transferRoutes);

app.use((error, req, res, next) => {
  console.error("Global error:", error);
  res.status(500).json({
    error: "something went wrong!",
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
