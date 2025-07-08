import React from 'react';
import TransactionCard from '../components/TransactionCard';

export default function Transactions() {
  const txList = [
    { type: 'Rent', amount: -250 },
    { type: 'Salary', amount: 900 },
    { type: 'Gift', amount: 60 },
  ];

  return (
    <div className="container my-5">
      <h2 className="mb-4">All Transactions</h2>
      {txList.map((tx, i) => <TransactionCard key={i} {...tx} />)}
    </div>
  );
}
