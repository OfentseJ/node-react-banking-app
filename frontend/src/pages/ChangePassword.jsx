import React from 'react';

export default function ChangePassword() {
  return (
    <div className="container my-5">
      <h2>Change Password</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input type="password" className="form-control" placeholder="Enter current password" />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input type="password" className="form-control" placeholder="Enter new password" />
        </div>
        <button type="submit" className="btn btn-primary">Update Password</button>
      </form>
    </div>
  );
}
