import { useState } from "react";


import Registration from "./seller/onboarding/registration/registration";
import AdminRegistration from "./admin/onboarding/registration/admin-registration";

function App() {
 
  return (
    <>
      <Registration />
      <AdminRegistration />
    </>
  );
}

export default App;
