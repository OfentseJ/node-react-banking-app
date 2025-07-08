import React, { useState } from 'react';

export default function Transfer() {
  const [form, setForm] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Transferred R${form.amount} to ${form.dest}`);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mt-4">
      <h2 className="mb-3">Transfer Funds</h2>
      <input
        className="form-control mb-3"
        name="source"
        placeholder="Source Account"
        onChange={handleChange}
      />
      <input
        className="form-control mb-3"
        name="dest"
        placeholder="Destination Account"
        onChange={handleChange}
      />
      <input
        className="form-control mb-3"
        name="amount"
        placeholder="Amount"
        type="number"
        onChange={handleChange}
      />
      <button type="submit" className="btn btn-warning w-100">
        Transfer
      </button>
    </form>
  );
}
