import "semantic-ui-css/semantic.min.css";
import React from "react";
import { Dropdown, Modal, Button } from "semantic-ui-react";
import DashboardHeader from "./dashboardHeader";
import TopHeader from "./topHeader";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toastr from 'toastr';
import 'toastr/build/toastr.css';


const statusOptions = [
  { key: "approve", text: "Approve", value: "Approve" },
  { key: "pending", text: "Pending", value: "Pending" },
  { key: "decline", text: "Decline", value: "Decline" },
];
function RedeemRequest()
{
  const navigate = useNavigate();
  const apiUrl = "https://dev.nexmil.app";
  const [redeemRequests, setRedeemRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [redeemId, setRedeemId] = useState('');
  // const [updatedResponse, setUpdatedResponse] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() =>
  {
    fetchRedeemRequests();
  }, []);

  const fetchRedeemRequests = async () =>
  {
    try
    {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/redeemRequest`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200)
      {
        setRedeemRequests(response.data);
        setLoading(false);
      }
    } catch (error)
    {
      if (error?.response != null && (error?.response?.status === 401 || error?.response?.status === 403))
      {
        toastr.error(`${error?.response.data.message ?? error?.response?.data}`, '', { timeOut: 1000 });
        navigate("/Login");
      }
    }
  };

  const handleStatusChange = (redeem_Id, value) =>
  {
    setRedeemId(redeem_Id);
    setSelectedStatus(value);
    setConfirmationModal(true);
  };
  const handleConfirmationModal = () =>
  {
    setConfirmationModal(false);
  };

  const handleSubmit = async () =>
  {
    try
    {
      setConfirmationModal(false);
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(`${apiUrl}/redeemRequest?redeem_Id=${redeemId}`, { Status: selectedStatus }, { headers: { Authorization: `Bearer ${token}` } });

      if (response.status === 200)
      {
        setLoading(false);
        fetchRedeemRequests();
      }
    }
    catch (error)
    {
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
                                      value={request.RequestStatus}
                                      disabled={request.RequestStatus === "Approve"}
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="loader_content">
          <img src="Spinner-1s-200px.svg" alt="Loading" />
        </div>
      )}
      <Modal
        open={confirmationModal}
        onClose={handleConfirmationModal}
        size="mini"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          margin: "auto",
          maxHeight: "70%",
          height: "auto",
        }}
      >
        {/* <div className="modal-header">
          <span>{editingUser?.Id == null ? "Add New User " : "Edit User"}</span>
          <button className="close_btn" onClick={handleClose} style={{ float: 'right' }}>
            &times;
          </button>
        </div> */}

        <Modal.Header>Confirm Status</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to change the status?</p>
        </Modal.Content>
        <Modal.Actions>
          <div className="text-right">
            <Button color="grey" onClick={handleConfirmationModal}>
              Cancel
            </Button>
            <Button color="red" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default RedeemRequest;
