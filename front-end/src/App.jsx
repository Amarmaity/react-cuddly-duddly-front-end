import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";

import Registration from "./seller/onboarding/registration/registration";
import AdminRegistration from "./admin/onboarding/registration/admin-registration";

function App() {
 
  return (
    <>
      <AdminRegistration />
      {/* <Registration /> */}
    </>
  );
}

export default App;
