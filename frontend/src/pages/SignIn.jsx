import React from 'react';

export default function SignIn() {
  return (
    <div className="container my-5">
      <h2 className="mb-4">Sign In</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" />
        </div>
        <button className="btn btn-primary">Log In</button>
      </form>
    </div>
  );
}
