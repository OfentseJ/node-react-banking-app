import React from 'react';

export default function AddAccount() {
  return (
    <div className="container my-5">
      <h2>Add New Account</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Account Name</label>
          <input type="text" className="form-control" placeholder="Enter account name" />
        </div>
        <div className="mb-3">
          <label className="form-label">Account Type</label>
          <select className="form-select">
            <option>Savings</option>
            <option>Checking</option>
            <option>Credit</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success">Create Account</button>
      </form>
    </div>
  );
}
