import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ IMPORTANT — THIS FIXES YOUR UI
import "./App.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="169811645533-flbfur2e7lk274mg02sjurto6daqrvkj.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
