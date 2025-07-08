import React from 'react';

export default function TransactionCard({ type, amount }) {
  const isIncome = amount >= 0;

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title mb-0">{type}</h5>
          <small className="text-muted">{isIncome ? 'Income' : 'Expense'}</small>
        </div>
        <span className={`badge fs-6 ${isIncome ? 'bg-success' : 'bg-danger'}`}>
          {isIncome ? `+R${amount}` : `-R${Math.abs(amount)}`}
        </span>
      </div>
    </div>
  );
}
