import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import MyInformation from './pages/MyInformation';
import ChangePassword from './pages/ChangePassword';
import AddAccount from './pages/AddAccount';
import DeactivateAccount from './pages/DeactivateAccount';
import Transfer from './pages/Transfer';
import Beneficiaries from './pages/Beneficiaries';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/my-information" element={<MyInformation />} />
          <Route path="/settings/change-password" element={<ChangePassword />} />
          <Route path="/settings/add-account" element={<AddAccount />} />
          <Route path="/settings/deactivate-account" element={<DeactivateAccount />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
