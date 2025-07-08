import React from 'react';

export default function Signup() {
  return (
    <div className="container my-5">
      <h2 className="mb-4">Sign Up</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Full Names</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Surname</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of birth</label>
          <input type="date" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Cellphone number</label>
          <input type="number" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm password</label>
          <input type="password" className="form-control" />

        </div>
        <button className="btn btn-primary">Create Account</button>
      </form>
    </div>
  );
}
