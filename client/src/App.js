import React, { useState, useEffect } from "react";
import "./styles.css";
import Home from "./containers/Home";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Login from "./components/auth/Login";
import RestLogin from "./components/auth/RestLogin";
import RestHome from "./containers/RestHome";
import { StateContext, useStateContext } from "./context/stateContext";
import { Toaster } from "react-hot-toast";
import RestImpact from "./components/restaurants/RestImpact";
import ImpactHome from "./components/restaurants/ImpactHome";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <StateContext>
          <Toaster toastOptions={{ duration: 2000 }} />
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/restaurants/*" element={<RestHome />} />
            <Route path="/restaurants/login" element={<RestLogin />} />
            <Route
              path="/restaurants/impactReport/:slug"
              element={<ImpactHome />}
            />
          </Routes>
        </StateContext>
      </BrowserRouter>
    </div>
  );
};

export default App;
