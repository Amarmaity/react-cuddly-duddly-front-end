import { BrowserRouter, Routes, Route } from "react-router-dom";

import Registration from "./seller/onboarding/registration/registration";
import AdminRegistration from "./admin/onboarding/registration/admin-registration";
import AdminLogin from "./admin/onboarding/login/adminLogin";
import AdminLayout from "./admin/adminComponents/layout/AdminLayout";
import Dashboard from "./admin/adminComponents/pages/dashboard";
import Seller from "./admin/adminComponents/pages/seller/seller";
import Product from "./admin/adminComponents/pages/product/product";

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

        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="seller" element={<Seller />} />
          <Route path="product" element={<Product />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
