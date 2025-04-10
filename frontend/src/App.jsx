import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Adjust paths as necessary
import SignIn from "./pages/SignIn";
import UploadVerification from "./pages/UploadVerification";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/signin"
            element={<SignIn />}
          />
          <Route
            path="/verify-signature"
            element={<UploadVerification />}
          />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;
