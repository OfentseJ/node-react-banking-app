import React from 'react';

export default function Dashboard() {
  return (
    <div className="container my-5">
      <h2 className="mb-4">Welcome to Your Dashboard</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card p-3 shadow-sm">
            <h5>Main Balance</h5>
            <h3 className="text-success">R999.99</h3>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card p-3 shadow-sm">
            <h5>Recent Activity</h5>
            <p className="text-muted">You received R900 salary</p>
          </div>
        </div>
      </div>
    </div>
  );
}
