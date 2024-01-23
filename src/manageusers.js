import "semantic-ui-css/semantic.min.css";
import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import axios from "axios";
import DashboardHeader from "./dashboardHeader";
import TopHeader from "./topHeader";
import toastr from 'toastr';
import 'toastr/build/toastr.css';

function ManageUsers() {
  const apiUrl = "https://dev.nexmil.app";
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const handleDeleteModalOpen = () => setDeleteModalOpen(true);
  const handleDeleteModalClose = () => setDeleteModalOpen(false);
  const [errors, setErrors] = useState(false);
  const handleOpen = () => {
    setModalOpen(true);
    setEditingUser(null);
  };
  const handleCheckboxChange = (index) => {
    setSelectedUserIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleDelete = async () => {
    debugger;
    try {
      if (selectedUserIndex !== null) {
        const userIdToDelete = users[selectedUserIndex].Id;

        const token = localStorage.getItem("token");

        const response = await axios.delete(
          `${apiUrl}/deleteUser?Id=${userIdToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(JSON.stringify(response.data));

        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.Id !== userIdToDelete)
        );
        setSelectedUserIndex(null);
        fetchData();
      } else {
        console.log("No user selected for deletion");
      }
    } catch (error) {
      console.error("Axios Error:", error);
      fetchData();
    }
  };
  const handleClose = () => setModalOpen(false);

  const fetchData = async () => {
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
      setUsers(response.data);
    } catch (error) {
      console.error("Axios Error:", error);
    }
  };

  
  useEffect(() => {
    // Use an asynchronous function within useEffect
    fetchData();
  }, []);
  const accountTypes = [
    {
      key: "Super Administrator",
      text: " Super Administrator",
      value: "Super Administrator",
    },
    { key: "Admin", text: "Admin", value: "Admin" },
    { key: "User", text: "User", value: "User" },
  ];

  const handleEditUser = (userId, user) => {
    debugger;
    setEditingUser(user);
    setModalOpen(true);
    // Perform the action you want when the edit icon is clicked
    console.log(`Editing user with ID: ${userId}`);
  };
  const validateEditingUserData = () => {
    if (!editingUser || !editingUser.FirstName) {
      setErrors(true);
      toastr.error('Error: First Name is required');
      
    }
  
    if (!editingUser || !editingUser.LastName) {
      setErrors(true);
      toastr.error('Error: Last Name is required');
     
    }
  
    if (!editingUser || !editingUser.Email) {
      setErrors(true);
      toastr.error('Error: Email is required');
     
    }
  
    if (!editingUser || !editingUser.AccountType) {
      setErrors(true);
      toastr.error('Error: Account Type is required');
   
    }
  
    if (!editingUser || !editingUser.Password) {
      setErrors(true);
      toastr.error('Error: Password is required');
     
    }
  
    return error ?? false; 
  };
  const handleSaveEdit = async () => {
    try {

      const isError = validateEditingUserData();

      if (isError) {
        return; // Validation failed, do not proceed with API request
      }

      const data = {
        Email: editingUser.Email,
        Password: editingUser.Password,
        FirstName: editingUser.FirstName,
        LastName: editingUser.LastName,
        AccountType: editingUser.AccountType,
      };

      const token = localStorage.getItem("token");
      const url = editingUser.Id
        ? `${apiUrl}/updateUser?Id=${editingUser.Id}`
        : `${apiUrl}/register`;

      const response = editingUser.Id
        ? await axios.put(url, data, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.post(url, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
      console.log(JSON.stringify(response.data));
      if (response.status== 200) {
        toastr.success(`Success: ${response.data.message }`);
       
      }
      setModalOpen(false);
      setEditingUser(null);
      fetchData();
    } catch (error) {
      console.error("Save error:", error);
      if (error?.response?.status !== 200) {
        setErrors(true);
        // Show error notification
        if (error?.response != null) {
          
          toastr.error(`Error: ${error?.response.data.message ?? error?.response?.data}`);
        }
      }
      // Handle error, show a message, or perform other actions as needed
      // setModalOpen(false);
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
                        <h3>Manage Users</h3>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div class="col-sm-12">
                      <div class="text-right top_btn">
                        <div class="d-flex gap-x-2 justify-content-end">
                          <button
                            onClick={handleOpen}
                            class="rounded-pill btn btn-primary btn-xs m120"
                          >
                            Add New User
                          </button>
                          <button
                            onClick={handleDeleteModalOpen}
                            class="rounded-pill btn btn-danger btn-xs m120"
                            disabled={selectedUserIndex === null}
                          >
                            Delete
                          </button>
                          
                        </div>
                       
                      </div>
                    </div>
                  </div>
                  <div className="table-container theme_table">
                    <table className="ui celled table table-borderless">
                      <thead>
                        <tr>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Account Type</th>
                          <th>Email</th>
                          <th>Actions </th>
                          <th className="action_content"></th>
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
                            <td>{user.AccountType}</td>
                            <td>{user.Email}</td>
                            <td>
                              <button
                                onClick={() => handleEditUser(user.Id, user)}
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                }}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
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

      <Modal
        open={modalOpen}
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
          height: "auto",
        }}
      >
        <Modal.Header>
        
          <span>{editingUser?.Id ==null ?"Add New User ":"Edit User"}</span>
        <button onClick={handleClose} style={{float:'right'}}>
          &times; 
        </button>   
        </Modal.Header>
        <Modal.Content>
        <Form>
          <Form.Field>
            <label>First Name</label>
            <input
              placeholder="First Name"
              value={editingUser ? editingUser.FirstName : ""}
              onChange={(e) =>
                setEditingUser({ ...editingUser, FirstName: e.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Last Name</label>
            <input
              placeholder="Last Name"
              value={editingUser ? editingUser.LastName : ""}
              onChange={(e) =>
                setEditingUser({ ...editingUser, LastName: e.target.value })
              }
            />

          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input
              placeholder="Email"
              value={editingUser ? editingUser.Email : ""}
              onChange={(e) =>
                setEditingUser({ ...editingUser, Email: e.target.value })
              }
            />

          </Form.Field>
          <Form.Field>
            <label>Account Type</label>
            <Dropdown
              placeholder="Select Account Type"
              fluid
              selection
              options={accountTypes}
              value={editingUser ? editingUser.AccountType : ""}
              onChange={(e, { value }) =>
                setEditingUser({ ...editingUser, AccountType: value })
              }
            />


          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input
              placeholder="Password"
              value={editingUser ? editingUser.Password : ""}
              onChange={(e) =>
                setEditingUser({ ...editingUser, Password: e.target.value })
              }
            />

          </Form.Field>
        </Form>
      </Modal.Content>
      
        <Modal.Actions>
          <div className="text-right">
             <Button color="blue" onClick={handleSaveEdit} >
              Save
            </Button>
            <Button color="grey" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Modal.Actions>
      </Modal>

      {/* Delete Modal */}

      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
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
        <Modal.Header>Delete User</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete the selected user?</p>
        </Modal.Content>
        <Modal.Actions>
          <div className="text-right">
            <Button color="grey" onClick={handleDeleteModalClose}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Modal.Actions>
      </Modal>
    </div>
   
  );
}

export default ManageUsers;
