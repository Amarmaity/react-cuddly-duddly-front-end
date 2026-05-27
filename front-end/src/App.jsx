import { useState } from "react";


import Registration from "./seller/onboarding/registration/registration";
import AdminRegistration from "./admin/onboarding/registration/admin-registration";
import AdminLogin from "./admin/onboarding/login/adminLogin";

function App() {
 
  return (
    <>
      <Registration />
      <AdminRegistration />
      <AdminLogin />
    </>
  );
}

export default App;
