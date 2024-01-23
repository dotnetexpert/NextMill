// App.js
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import "./login.css";
import "./manageusers";
import "./dashboard.css";
import Login from "./login";
import ManageUsers from "./manageusers";
import Referrals from "./referrals";
import RedeemRequest from "./redeemrequest";
import Dashboard from "./dashboard";
import DashboardHeader from "./dashboardHeader";
import TopHeader from "./topHeader";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="Login" element={<Login />} />
          <Route path="manageusers" element={<ManageUsers />} />
          <Route path="referrals" element={<Referrals />} />
          <Route path="redeemrequest" element={<RedeemRequest />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboardHeader" element={<DashboardHeader />} />
          <Route path="topHeader" element={<TopHeader />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
