import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class JSONDatabase {
  constructor() {
    this.dataPath = path.join(__dirname);
  }

  async readFile(filename) {
    try {
      const filePath = path.join(this.dataPath, filename);
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error Reading ${filename}:`, error);
      throw error;
    }
  }

  async writeFile(filename, data) {
    try {
      const filePath = path.join(this.dataPath, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      throw error;
    }
  }

  //User Operations
  async getAllUsers() {
    return await this.readFile("users.json");
  }

  async getUserById(id) {
    const data = await this.readFile("users.json");
    return data.users.find((user) => user.user_id === parseInt(id));
  }

  async getUserByEmail(email) {
    const data = await this.readFile("users.json");
    return data.users.find((user) => user.email === email);
  }

  async createUser(userData) {
    const data = await this.readFile("users.json");
    const newUser = {
      user_id: new Date().toISOString(),
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    data.users.push(newUser);
    await this.writeFile("users.json", data);
    return newUser;
  }

  async updateUser(id, updateData) {
    const data = await this.readFile("users.json");
    const userIndex = data.users.findIndex(
      (user) => user.user_id === parseInt(id)
    );
    if (userIndex === -1) throw new Error("User not Found");

    data.users[userIndex] = {
      ...data.users[userIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };
    await this.writeFile("users.json", data);
    return data.users[userIndex];
  }

  //Account Operations
  async getAllAccounts() {
    return await this.readFile("accounts.json");
  }

  async getAccountById(id) {
    const data = await this.readFile("accounts.json");
    return data.accounts.find((account) => account.account_id === parseInt(id));
  }

  async getAccountsByUserId(userId) {
    const data = await this.readFile("accounts.json");
    return data.accounts.filter(
      (account) => account.user_id === parseInt(userId)
    );
  }

  async getAccountByNumber(accountNum) {
    const data = await this.readFile("accounts.json");
    return data.accounts.find(
      (account) => account.account_number === accountNum
    );
  }

  async createAccount(accountData) {
    const data = await this.readFile("accounts.json");
    const newAccount = {
      account_id: new Date().toISOString,
      ...accountData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    data.accounts.push(newAccount);
    await this.writeFile("accounts.json", data);
    return newAccount;
  }

  async updateAccount(id, updateData) {
    const data = await this.readFile("accounts.json");
    const accountIndex = data.accounts.findIndex(
      (account) => account.account_id === parseInt(id)
    );
    if (accountIndex === -1) throw new Error("Account not found");

    data.accounts[accountIndex] = {
      ...data.accounts[accountIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };
    await this.writeFile("accounts.json", data);
    return data.accounts[accountIndex];
  }

  //Transactions operations
  async getAllTransactions() {
    return await this.readFile("transactions.json");
  }

  async getTransactionsByAccountId(accountId) {
    const data = await this.readFile("transactions.json");
    return data.transactions.filter(
      (transaction) => transaction.account_id === parseInt(accountId)
    );
  }

  async getTransactionById(id) {
    const data = await this.readFile("transactions.json");
    return data.transactions.find(
      (transaction) => transaction.transaction_id === parseInt(id)
    );
  }

  async createTransaction(transactionData) {
    const data = await this.readFile("transactions.json");
    const newTransaction = {
      transaction_id: new Date().toISOString(),
      ...transactionData,
      created_at: new Date().toISOString(),
    };
    data.transactions.push(newTransaction);
    await this.writeFile("transactions.json", data);
    return newTransaction;
  }

  //Transfer operations
  async getAllTransfers() {
    return await this.readFile("transfers.json");
  }

  async getTransferById(id) {
    const data = await this.readFile("transfers.json");
    return data.transfers.find(
      (transfer) => transfer.transfer_id === parseInt(id)
    );
  }

  async getTransfersByAccountId(accountId) {
    const data = await this.readFile("transfers.json");
    return data.transfers.filter(
      (transfer) =>
        transfer.from_account_id === parseInt(accountId) ||
        transfer.to_account_id === parseInt(accountId)
    );
  }

  async createTransfer(transferData) {
    const data = await this.readFile("transfers.json");
    const newTransfer = {
      transfer_id: new Date().toISOString(),
      ...transferData,
      created_at: new Date().toISOString(),
    };
    data.transfers.push(newTransfer);
    await this.writeFile("transfers.json", data);
    return newTransfer;
  }

  async updateTransfer(id, updateData) {
    const data = await this.readFile("transfers.json");
    const transferIndex = data.transfers.findIndex(
      (transfer) => transfer.transfer_id === parseInt(id)
    );
    if (transferIndex === -1) throw new Error("Transfer not found");

    data.transfers[transferIndex] = {
      ...data.transfers[transferIndex],
      ...updateData,
    };
    await this.writeFile("transfers.json", data);
    return data.transfers[transferIndex];
  }

  //Utility funcitons
  generateAccountNumber() {
    return "ACC" + Date.now() + Math.floor(Math.random() * 1000);
  }

  generateReferenceNumber(type = "TXN") {
    return type + Date.now() + Math.floor(Math.random() * 1000);
  }

  //Banking operations
  /**
   * Name: performWithdrawal
   * Description:
   * Handles the withdrawal of funds from an account.
   * Expects account_id, amount, and an optional description.
   * Validates the account, checks if the amount is positive,
   * and ensures sufficient funds are available.
   */
  async performDeposit(accountId, amount, description) {
    try {
      const account = await this.getAccountById(accountId);
      if (!account) throw new Error("Account not Found");

      const newBalance = parseFloat(account.balance) + parseFloat(amount);
      await this.updateAccount(accountId, { balance: newBalance });

      const transaction = await this.createTransaction({
        account_id: accountId,
        amount: parseFloat(amount),
        transaction_type: "deposit",
        description: description || "Deposit",
        transaction_date: new Date().toISOString(),
        running_balance: newBalance,
        status: "completed",
        reference_number: this.generateReferenceNumber("TXN"),
      });

      return { success: true, transaction, newBalance };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   *Name: performTransfer
   * 
   * Description:
   * Handles the transfer of funds between two accounts.
   * Expects from_account_id, to_account_id, amount, and an optional description.
   * Validates the accounts, checks if the amount is positive,
   * and ensures sufficient funds are available.
   */
  async performTransfer(fromAccountId, toAccountId, amount, description) {
    try {
      const fromAccount = await this.getAccountById(fromAccountId);
      const toAccount = await this.getAccountByNumber(toAccountNumber);

      if (!fromAccount) throw new Error("Source account not found");
      if (!toAccount) throw new Error("Destination account not found");

      if (parseFloat(fromAccount.balance) < parseFloat(amount)) {
        throw new Error("Insufficient funds");
      }

      const fromNewBalance =
        parseFloat(fromAccount.balance) - parseFloat(amount);
      const toNewBalance = parseFloat(toAccount.balance) + parseFloat(amount);

      await this.updateAccount(fromAccountId, { balance: fromNewBalance });
      await this.updateAccount(toAccountId, { balance: toNewBalance });

      const transfer = await this.createTransfer({
        from_account_id: fromAccountId,
        to_account_id: toAccountId,
        amount: parseFloat(amount),
        transfer_date: new Date().toISOString(),
        status: "completed",
        reference_number: this.generateReferenceNumber("TRF"),
        completed_at: new Date().toISOString(),
      });

      await this.createTransaction({
        account_id: fromAccountId,
        amount: parseFloat(amount),
        transaction_type: "transfer",
        description: `Transfer to ${toAccountNumber}: ${
          description || "Transfer"
        }`,
        transaction_date: new Date().toISOString(),
        running_balance: fromNewBalance,
        status: "completed",
        reference_number: transfer.reference_number,
      });

      await this.createTransaction({
        account_id: toAccount.account_id,
        amount: parseFloat(amount),
        transaction_type: "deposit",
        description: `Transfer from ${fromAccount.account_number}: ${
          description || "Transfer"
        }`,
        transaction_date: new Date().toISOString(),
        running_balance: toNewBalance,
        status: "completed",
        reference_number: transfer.reference_number,
      });

      return { success: true, transfer };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new JSONDatabase();
