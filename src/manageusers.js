import "semantic-ui-css/semantic.min.css";
import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Dropdown } from "semantic-ui-react";
import axios from "axios";
import DashboardHeader from "./dashboardHeader";
import TopHeader from "./topHeader";
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import { useNavigate } from "react-router-dom";


function ManageUsers()
{
  const navigate = useNavigate();
  const apiUrl = "https://dev.nexmil.app";
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const handleDeleteModalOpen = () => setDeleteModalOpen(true);
  const handleDeleteModalClose = () => setDeleteModalOpen(false);
  const [errors, setErrors] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpen = () =>
  {
    setModalOpen(true);
    setEditingUser(null);
  };
  const handleCheckboxChange = (index) =>
  {
    setSelectedUserIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleDelete = async () =>
  {

    try
    {
      if (selectedUserIndex !== null)
      {
        setLoading(true);

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
        if (response.status === 200)
        {
          setLoading(false);
          toastr.success(`${response.data.message}`, '', { timeOut: 1000 });
        }
        setDeleteModalOpen(false);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.Id !== userIdToDelete)
        );
        fetchData();
        setSelectedUserIndex(null);
      }
    } catch (error)
    {
      setLoading(false);
      console.error("Axios Error:", error);
      fetchData();
    }
  };
  const handleClose = () => setModalOpen(false);

  const fetchData = async () =>
  {
    try
    {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/getUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.status === 200)
      {
        setUsers(response?.data);
        setLoading(false);
      }

    } catch (error)
    {

      if (error?.response != null && (error?.response?.status === 401 || error?.response?.status === 403))
      {

        toastr.error(`${error?.response.data.message ?? error?.response?.data}`, '', { timeOut: 1000 });
        navigate("/Login");
      }

      console.error("Axios Error:", error);
    }
  };

  useEffect(() =>
  {
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

  const handleEditUser = (userId, user) =>
  {
    setEditingUser(user);
    setModalOpen(true);
  };
  const validateEditingUserData = () =>
  {
    let error = false;
    if (!editingUser || !editingUser.FirstName)
    {
      setErrors(true);
      error = true;
      toastr.error('First Name is required', '', { timeOut: 1000 });

    }

    if (!editingUser || !editingUser.LastName)
    {
      setErrors(true);
      error = true;
      toastr.error('Last Name is required', '', { timeOut: 1000 });

    }

    if (!editingUser || !editingUser.Email)
    {
      setErrors(true);
      error = true;
      toastr.error('Email is required', '', { timeOut: 1000 });

    }

    if (!editingUser || !editingUser.AccountType)
    {
      setErrors(true);
      error = true;
      toastr.error('Account Type is required', '', { timeOut: 1000 });

    }

    if (!editingUser || !editingUser.Password)
    {
      setErrors(true);
      error = true;
      toastr.error('Password is required', '', { timeOut: 1000 });

    }

    return error ?? false;
  };
  const handleSaveEdit = async () =>
  {
    try
    {
      const isError = validateEditingUserData();
      if (isError)
      {
        return;
      }

      setLoading(true);

      const data = {
        Email: editingUser.Email,
        Password: password ?? null,
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
      if (response.status === 200)
      {
        setModalOpen(false);
        toastr.success(`${response?.data?.message}`, '', { timeOut: 1000 });
        setLoading(false);
      }
      // setModalOpen(false);
      setEditingUser(null);
      setSelectedUserIndex(null);
      fetchData();
    } catch (error)
    {
      console.error("Save error:", error);
      if (error?.response?.status !== 200)
      {
        setErrors(true);
        // Show error notification
        if (error?.response != null)
        {
          setLoading(false);
          toastr.error(`${error?.response.data.message ?? error?.response?.data}`, '', { timeOut: 1000 });
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
                                style={{ width: "13px", height: "13px", marginRight: "4px" }}
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
                                disabled={selectedUserIndex !== index}
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
      {loading && (
        <div className="loader_content">
          <img src="Spinner-1s-200px.svg" alt="Loading" />
        </div>
      )}
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
          width: "400px",
          margin: "auto",
          maxHeight: "90%",
          height: "auto",
        }}
      >
        <Modal.Header>
          <div className="modal-header">
            <span>{editingUser?.Id == null ? "Add New User " : "Edit User"}</span>
            <button className="close_btn" onClick={handleClose} style={{ float: 'right' }}>
              &times;
            </button>
          </div>

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
                value={editingUser?.Id ? password : editingUser?.Password}
                onChange={(e) =>
                {
                  setEditingUser({ ...editingUser, Password: e.target.value })
                  setPassword(e.target.value)
                }
                }
              />

            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <div className="text-right">
            <Button color="blue" onClick={handleSaveEdit} >
              {editingUser?.Id == null ? "Save " : "Update"}
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
          width: "450px",
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
