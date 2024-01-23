import "semantic-ui-css/semantic.min.css";
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import DashboardHeader from "./dashboardHeader";
import TopHeader from "./topHeader";
import axios from "axios";
import toastr from 'toastr';
import 'toastr/build/toastr.css';

function Referrals() {
  const apiUrl = "https://dev.nexmil.app";
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [addReferrals, setReferrals] = useState(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [errors, setErrors] = useState(false);



  const getUsersList = async () => {
    try {
      debugger;
      // console.log("apiUrl",apiUrl)
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/getUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(JSON.stringify(response.data));
      // setUsers(response.data);
      const data = response.data.map((user) => ({
        key: user.Id,
        value: `${user.FirstName} ${user.LastName}`,
        text: `${user.FirstName} ${user.LastName}`, // Ensure you include the 'text' property for display
      }));
      setUsersList(data);
      // console.log("data",data);
      
    } catch (error) {
      console.error("Axios Error:", error);
    }
  };


  const fetchData = async () => {
    
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${apiUrl}/getReferrals`,  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(JSON.stringify(response.data));
      setUsers(response.data);
    } catch (error) {
      console.error("Axios Error:", error);
    }
  };

  const handleCheckboxChange = (index) => {
    setSelectedUserIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setReferrals(null);

    setModalOpen(false);

  }

  useEffect(() => {
    fetchData();
  },[]);

  useEffect(() => {
    getUsersList();
  },[modalOpen]);

  const validateReferralData = () => {
    if (!addReferrals || !addReferrals.FirstName) {
      setErrors(true);
      toastr.error('Error: First Name is required');
      // return false;
    }
  
    if (!addReferrals || !addReferrals.LastName) {
      setErrors(true);
      toastr.error('Error: Last Name is required');
      // return false;
    }
  
    if (!addReferrals || !addReferrals.PhoneNumber) {
      setErrors(true);
      toastr.error('Error: PhoneNumber is required');
      // return false;
    }
  
    if (!addReferrals || !addReferrals.Notes) {
      setErrors(true);
      toastr.error('Error: Notes is required');
      // return false;
    }
  
    if (!addReferrals || !addReferrals.CoinRewards) {
      setErrors(true);
      toastr.error('Error: CoinRewards is required');
      // return false;
    }
  
    if (!addReferrals || !addReferrals.Status) {
      setErrors(true);
      toastr.error('Error: Status is required');
      // return false;
    }
  
    if (!addReferrals || !addReferrals.ReferredBy) {
      setErrors(true);
      toastr.error('Error: Referrals to is required');
      // return false;
    }
  
    return  errors ?? false; // Validation passed
  };
  const handleSaveEditRef = async () => {
    try {
      debugger
      const isError = validateReferralData();

      if (isError) {
        return;
      }
        const data = {
          FirstName: addReferrals.FirstName,
          LastName: addReferrals.LastName,
          PhoneNumber: addReferrals.PhoneNumber,
          Notes: addReferrals.Notes,
          ReferredBy: addReferrals.ReferredBy,
          CoinRewards: addReferrals.CoinRewards,
          Status: addReferrals.Id ?  addReferrals.Status:"Pending"
        };
  
        const token = localStorage.getItem("token");
        const url = addReferrals.Id ?`${apiUrl}/updateReferral?Id=${addReferrals.Id}`: `${apiUrl}/createReferrals`;
  
    
  
        const response = await axios.post(url, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log(JSON.stringify(response.data));
        if (response.status== 200) {
          toastr.success(`Success: ${response.data.message }`);
         
        }
        setModalOpen(false);
        fetchData();
      
    } catch (error) {
      console.error("Save error:", error);
      // Handle error, show a message, or perform other actions as needed
      if (error?.response != null) {
          
        toastr.error(`Error: ${error?.response.data.message ?? error?.response?.data}`);
      }
    }
  };
  
  const handleEditUser = (userId, user) => {
    debugger;
    setReferrals(user);
    setModalOpen(true);
    // Perform the action you want when the edit icon is clicked
    console.log(`Editing user with ID: ${userId}`);
  };
  const handleDeleteModalOpen = () => setDeleteModalOpen(true);

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedUserId(null);
  };
  const handleDeleteUser = async () => {

    try {
      debugger
      if (selectedUserIndex !== null) {
        const userIdToDelete = users[selectedUserIndex].id;

        const token = localStorage.getItem("token");

        const response = await axios.delete(
          `${apiUrl}/deleteReferral?referral_id=${userIdToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(JSON.stringify(response.data));

        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userIdToDelete)
        );
        setSelectedUserIndex(null);
        fetchData();
      } else {
        console.log("No user selected for deletion");
      }
    } catch (error) {
      console.error("Axios Error:", error);
      if (error?.response != null) {
          
        toastr.error(`Error: ${error?.response.data.message ?? error?.response?.data}`);
      }
      else{
        toastr.error(`Error: ${error}`)
      }
      fetchData();
    }
    handleDeleteModalClose();
  };

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
                        <div class="col-sm-12">
                          <div class="card_title_heading">
                              <h3>Referrals</h3>
                            </div>
                        </div>
                      </div>

                      <div className="row">
                          <div class="col-sm-12">
                            <div class="text-right top_btn">
                                <div class="d-flex gap-x-2 justify-content-end">
                                      <button onClick={handleOpen} class="rounded-pill btn btn-primary btn-xs m120" >Add New Referrals</button>
                                      <button onClick={handleDeleteModalOpen} class="rounded-pill btn btn-danger btn-xs m120"  disabled={selectedUserIndex === null}>Delete Referrals</button>
                                </div>
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
                                <th>Phone #</th>
                                <th>Notes</th>
                                <th>Status</th>
                                <th>ReferredBy</th>
                                <th>CoinRewards</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                            {users.map((user, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                style={{ width: "13px", height: "13px" }}
                                checked={selectedUserIndex === index}
                                onChange={() => handleCheckboxChange(index)}
                              />
                              {user.FirstName}
                            </td>
                            <td>{user.LastName}</td>
                            <td>{user.PhoneNumber}</td>
                            <td>{user.Notes}</td>
                            <td>{user.Status}</td>
                            <td>{user.ReferredBy}</td>
                            <td>{user.CoinRewards}</td>


                            <td>
                              <button
                                onClick={() => handleEditUser(user.id, user)}
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                }}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                            </td>
                            <td></td>
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

      <Modal
        open={modalOpen}
        onClose={handleClose}
        closeOnDimmerClick={false}
        closeOnDocumentClick={false}
        size="mini"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "650px",
          margin: "auto",
          maxHeight: "90%",
          height:"auto",
        }}
      >
        <Modal.Header>
        
        <span>{addReferrals?.id ==null ?"Add Referrals ":"Edit Referrals"}</span>

        <button onClick={handleClose} style={{float: 'right'}}>
          &times; 
        </button>   
        </Modal.Header>
        
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>First Name</label>
              <input placeholder="First Name"
              value={addReferrals ? addReferrals.FirstName : ""}
              // Update the value of the input with the corresponding user data
              onChange={(e) =>
                setReferrals({ ...addReferrals, FirstName: e.target.value })
              }
               />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <input placeholder="Last Name" 
              value={addReferrals ? addReferrals.LastName : ""}
              // Update the value of the input with the corresponding user data
              onChange={(e) =>
                setReferrals({ ...addReferrals, LastName: e.target.value })
              }
              />
            </Form.Field>
            <Form.Field>
              <label>Phone #</label>
              <input placeholder="Phone #"
              value={addReferrals ? addReferrals.PhoneNumber : ""}
              // Update the value of the input with the corresponding user data
              onChange={(e) =>
                setReferrals({ ...addReferrals, PhoneNumber: e.target.value })
              }
               />
            </Form.Field>
            <Form.Field>
              <label>Notes</label>
              <input placeholder="Notes" 
               value={addReferrals ? addReferrals.Notes : ""}
               // Update the value of the input with the corresponding user data
               onChange={(e) =>
                 setReferrals({ ...addReferrals, Notes: e.target.value })
               }
               />
            </Form.Field>
            {addReferrals?.id !== undefined &&<Form.Field>
              <label>Status</label>
              <Dropdown
                placeholder="Select Status"
                fluid
                selection
                options={[
                  { key: "pending", text: "Pending", value: "Pending" },
                 { key: "approved", text: "Approved", value: "Approved" },
                 { key: "disapproved", text: "Disapproved", value: "Disapproved" },

                ]}
                value={addReferrals ? addReferrals.Status : ""}
                onChange={(e, { value }) =>
                  setReferrals({ ...addReferrals, Status: value })
                }
              />
            </Form.Field>}
            <Form.Field>
              <label>Attribute Referrals to:</label>
              <Dropdown
                placeholder="Attribute Referrals to:"
                fluid
                selection
                options={usersList}
                // value={addReferrals ? addReferrals.AccountType : ""}
                onChange={(e, { value }) =>
                  setReferrals({ ...addReferrals, ReferredBy: value })
                }
              />
            </Form.Field>
            <Form.Field>
              <label>Events=coln Rewards</label>
              <input placeholder="VIP"
              type="number"
              value={addReferrals ? addReferrals.CoinRewards : ""}
              // Update the value of the input with the corresponding user data
              onChange={(e) =>
                setReferrals({ ...addReferrals, CoinRewards: e.target.value })
              }
               />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <div className="text-right">
              <Button color="blue" onClick={handleSaveEditRef}>
                Save
              </Button>
              <Button color="gray" onClick={handleClose}>
                close
              </Button>
          </div>
        </Modal.Actions>
      </Modal>

      {/*//deleteModalOpen state for delete modal visibility */}

      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        closeOnDimmerClick={false}
        closeOnDocumentClick={false}
        size="mini"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          margin: "auto",
          maxHeight: "50%",
          height:"auto",
        }}
      >
        <Modal.Header>Delete Referrals</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete the selected referrals?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="grey" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default Referrals;
