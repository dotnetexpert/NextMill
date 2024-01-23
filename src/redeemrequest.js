import "semantic-ui-css/semantic.min.css";
import React from "react";
import { Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import DashboardHeader from "./dashboardHeader";
import TopHeader from "./topHeader";
import { useState, useEffect } from "react";
import axios from "axios";

const statusOptions = [
  { key: "approve", text: "Approve", value: "Approve" },
  { key: "pending", text: "Pending", value: "Pending" },
  { key: "decline", text: "Decline", value: "Decline" },
];
function RedeemRequest() {
  const [redeemRequests, setRedeemRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRedeemRequests();
  },  [selectedStatus]);

  const fetchRedeemRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://dev.nexmil.app/redeemRequest", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRedeemRequests(response.data);
      setSelectedStatus(response.data[0].RequestStatus);
    } catch (error) {
      console.error("Error fetching redeem requests:", error);
    }
  };
  // frontend.js

  const handleStatusChange = async (redeem_Id, value) => {
    try {
      setLoading(true);
      if (selectedStatus === "Approve" ) {
      
        setLoading(false);  
        return;  
      }
  
     
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `https://dev.nexmil.app/redeemRequest?redeem_Id=${redeem_Id}`,
        {
          Status: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
     

      setSelectedStatus(value);
      setLoading("");}
    catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="vh-100">
        <div className="main_dashboard h-100">
          <div className="row">
            <div className="ui bottom attached segment pushable main_dashboardContent">
              <DashboardHeader />

              <div className="pusher dashboard_rightSide">
                <TopHeader />
                <div className="page-content">
                  <div className="row">
                    <div class="col-sm-12">
                      <div class="card_title_heading">
                        <h3>Redeem Request</h3>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12">
                      <div className="table-container theme_table">
                        <table className="ui celled table table-borderless">
                          <thead>
                            <tr>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>Product Request</th>
                              <th>Coin Amount</th>
                              <th>RequestStatus</th>
                              <th style={{ width: "180px" }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {redeemRequests.map((request) => (
                              <tr key={request.id}>
                                <td>{request.FirstName}</td>
                                <td>{request.LastName}</td>
                                <td>{request.ProductRequest}</td>
                                <td>{request.CoinAmount}</td>

                                <td>
                                  <div className="text-right">
                                    <Dropdown
                                      placeholder={request.RequestStatus}
                                      fluid
                                      selection
                                      options={statusOptions}
                                      value={selectedStatus}
                                       disabled={selectedStatus === "Approve"} 
                                      onChange={(event, data) =>
                                        handleStatusChange(
                                          request.id,
                                          data.value
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {loading && (
                          <img src="Spinner-1s-200px.svg" alt="Loading" />
                        )}
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
