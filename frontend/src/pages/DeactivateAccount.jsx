import React from 'react';

export default function DeactivateAccount() {
  return (
    <div className="container my-5">
      <h2>Deactivate Account</h2>
      <p>Warning: Deactivating your account will disable access to all services.</p>
      <button className="btn btn-warning me-2">Temporarily Deactivate</button>
      <button className="btn btn-danger">Permanently Delete</button>
    </div>
  );
}
