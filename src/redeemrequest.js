import "semantic-ui-css/semantic.min.css";
import React from "react";
import { Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import DashboardHeader from "./dashboardHeader";
import TopHeader from "./topHeader";
const statusOptions = [
  { key: "approve", text: "Approve", value: "Approve" },
  { key: "decline", text: "Decline", value: "Decline" },
];

function RedeemRequest() {
  return (
    <div className="container-fluid">
      <div className="vh-100">
          <div className="main_dashboard h-100">
            <div className="row">
              <div className="ui bottom attached segment pushable main_dashboardContent">
                <DashboardHeader/>
                {/* <div
                  className="ui visible inverted left vertical sidebar menu" style={{ width: "280px", }}
                >
                  <a className="logo_item">
                    <img src="../../dashboard_logo.png" alt="logo" />
                  </a>
                  <div className="dashboard_links">
                      <Link to="/dashboard" className="item">
                        Dashboard
                      </Link>
                      <Link to="/manageusers" className="item">
                        Manage Users
                      </Link>
                      <Link to="/referrals" className="item">
                        Referrals
                      </Link>
                      <Link to="/redeemrequest" className="item">
                        Redeem Request
                      </Link>
                  </div>
                </div> */}
                <div className="pusher dashboard_rightSide">
                <TopHeader/>
                  <div className="page-content">
                      <div className="row">
                          <div className="col-sm-12">
                            <div className="card_title_heading">
                                <h3>Redeem Request</h3>
                              </div>
                          </div>
                      </div>

                      <div className="row">
                      <div className="col-sm-12">
                        <div  className="table-container theme_table">
                          <table className="ui celled table table-borderless" >
                              <thead>
                                <tr>
                                  <th>First Name</th>
                                  <th>Last Name</th>
                                  <th>Product Request</th>
                                  <th>Coin Amount</th>
                                  <th style={{ width: '180px' }}></th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td style={{ height: "40px" }}>John</td>
                                  <td style={{ height: "40px" }}>Doe</td>
                                  <td style={{ height: "40px" }}>White Hat</td>
                                  <td style={{ height: "40px" }}>50</td>
                                  <td>
                                    <div className="text-right">
                                        <Dropdown
                                          placeholder="Select Action"
                                          fluid
                                          selection
                                          options={statusOptions}
                                        />
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td style={{ height: "40px" }}>Emma</td>
                                  <td style={{ height: "40px" }}>Wastson</td>
                                  <td style={{ height: "40px" }}>Guest</td>
                                  <td style={{ height: "40px" }}>550</td>
                                  <td>
                                     <div className="text-right">
                                        <Dropdown
                                          placeholder="Select Action"
                                          fluid
                                          selection
                                          options={statusOptions}
                                        />
                                       </div>
                                  </td>
                                </tr>
                              </tbody>
                           </table>
                        </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default RedeemRequest;
