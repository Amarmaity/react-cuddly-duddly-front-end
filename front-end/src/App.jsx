import { BrowserRouter, Routes, Route } from "react-router-dom";

import Registration from "./seller/onboarding/registration/registration";
import AdminRegistration from "./admin/onboarding/registration/admin-registration";
import AdminLogin from "./admin/onboarding/login/adminLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Page */}
        <Route path="/" element={<AdminLogin />} />

        {/* Seller Registration */}
        <Route path="/seller-register" element={<Registration />} />

        {/* Admin Registration */}
        <Route path="/admin-register" element={<AdminRegistration />} />

        {/* Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
