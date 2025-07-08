import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

 const options = [
  { label: 'My Information', description: 'View and update your personal details', path: '/settings/my-information' },
  { label: 'Change Password', description: 'Update your login credentials', path: '/settings/change-password' },
  { label: 'Add New Account', description: 'Link another user account to your profile', path: '/settings/add-account' },
  { label: 'Deactivate Account', description: 'Temporarily or permanently disable your account', path: '/settings/deactivate-account' },
];


  const handleSignOut = () => {
    // TODO: Add your sign out logic here
    alert('You have signed out.');
    navigate('/signin');
  };

  return (
    <div className="container my-5" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4">Settings</h2>
      <div className="list-group mb-4">
        {options.map((option, idx) => (
          <button
            key={idx}
            type="button"
            className="list-group-item list-group-item-action"
            onClick={() => navigate(option.path)}
          >
            <div className="fw-bold">{option.label}</div>
            <small className="text-muted">{option.description}</small>
          </button>
        ))}
      </div>

      <button
        className="btn btn-danger w-100"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
}
