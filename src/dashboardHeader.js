import React from "react";
import { Grid, GridRow, GridColumn } from "semantic-ui-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./dashboard.css";
import { Link ,useLocation  } from "react-router-dom";



function DashboardHeader() {

    const location = useLocation();

    const isLinkActive = (path) => {
      return location.pathname === path;
    };
  return (
    <div className="ui visible inverted left vertical sidebar menu" style={{ width: "280px", }}>
    <a className="logo_item">
      <img src="../../dashboard_logo.png" alt="logo" />
    </a>
    <div className="dashboard_links">
        <Link to="/dashboard" className={`item ${isLinkActive("/dashboard") ? "active" : ""}`}>
          Dashboard
        </Link>
        <Link to="/manageusers" className={`item ${isLinkActive("/manageusers") ? "active" : ""}`}>
          Manage Users
        </Link>
        <Link to="/referrals" className={`item ${isLinkActive("/referrals") ? "active" : ""}`}>
          Referrals
        </Link>
        <Link to="/redeemrequest" className={`item ${isLinkActive("/redeemrequest") ? "active" : ""}`}>
          Redeem Request
        </Link>
    </div>
  </div>
  );
}

export default DashboardHeader;
