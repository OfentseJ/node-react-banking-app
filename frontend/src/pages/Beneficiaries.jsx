import React from 'react';
import BeneficiaryCard from '../components/BeneficiaryCard';

export default function Beneficiaries() {
  const beneficiaries = [
    { name: 'LL Gama', accountNumber: '1405678992' },
    { name: 'AM Ngcobo', accountNumber: '2147470986' },
  ];

  return (
    <div className="container my-5">
      <h2 className="mb-4">Beneficiaries</h2>
      {beneficiaries.map((b, i) => <BeneficiaryCard key={i} {...b} />)}
    </div>
  );
}
