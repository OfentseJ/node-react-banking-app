import React from 'react';

export default function BeneficiaryCard({ name, accountNumber }) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text text-muted">Account: {accountNumber}</p>
        <button className="btn btn-outline-primary btn-sm">Send Money</button>
      </div>
    </div>
  );
}
