import "semantic-ui-css/semantic.min.css";
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Dropdown } from "semantic-ui-react";
import DashboardHeader from "./dashboardHeader";
import TopHeader from "./topHeader";
import axios from "axios";
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import { useNavigate } from "react-router-dom";

function Referrals()
{
  const navigate = useNavigate();
  const apiUrl = "https://dev.nexmil.app";
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [addReferrals, setReferrals] = useState(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState(false);

  const getUsersList = async () =>
  {
    try
    {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/getUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.map((user) => ({
        key: user.Id,
        value: `${user.FirstName} ${user.LastName}`,
        text: `${user.FirstName} ${user.LastName}`, // Ensure you include the 'text' property for display
      }));
      setUsersList(data);

    } catch (error)
    {
      console.error("Axios Error:", error);
    }
  };


  const fetchData = async () =>
  {

    try
    {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`${apiUrl}/getReferrals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200)
      {
        setUsers(response.data);
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

  const handleCheckboxChange = (index) =>
  {
    setSelectedUserIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleOpen = () =>
  {
    setModalOpen(true);
  };

  const handleClose = () =>
  {
    setReferrals(null);

    setModalOpen(false);

  }

  useEffect(() =>
  {
    fetchData();
  }, []);

  useEffect(() =>
  {
    getUsersList();
  }, [modalOpen]);

  const validateReferralData = () =>
  {

    let error = false;
    if (!addReferrals || !addReferrals.FirstName)
    {
      setErrors(true);
      error = true;
      toastr.error('First Name is required', '', { timeOut: 1000 });
    }

    if (!addReferrals || !addReferrals.LastName)
    {
      setErrors(true);
      error = true;
      toastr.error('Last Name is required', '', { timeOut: 1000 });
    }

    if (!addReferrals || !addReferrals.PhoneNumber)
    {
      setErrors(true);
      error = true;
      toastr.error('PhoneNumber is required', '', { timeOut: 1000 });
    }

    if (!addReferrals || !addReferrals.Notes)
    {
      setErrors(true);
      error = true;
      toastr.error('Notes is required', '', { timeOut: 1000 });
    }

    if (!addReferrals || !addReferrals.CoinRewards)
    {
      setErrors(true);
      error = true;
      toastr.error('CoinRewards is required', '', { timeOut: 1000 });
    }

    if (!addReferrals && (!addReferrals.Status && addReferrals?.id !== undefined))
    {
      setErrors(true);
      error = true;
      toastr.error('Status is required', '', { timeOut: 1000 });
    }

    if (!addReferrals || !addReferrals.ReferredBy)
    {
      setErrors(true);
      error = true;
      toastr.error('Referrals to is required', '', { timeOut: 1000 });

    }

    return error ?? false;
  };

  const handleSaveEditRef = async () =>
  {
    try
    {
      const isError = validateReferralData();

      if (isError)
      {
        // setReferrals(null);
        return;
      }
      setLoading(true);

      const data = {
        FirstName: addReferrals.FirstName,
        LastName: addReferrals.LastName,
        PhoneNumber: addReferrals.PhoneNumber,
        Notes: addReferrals.Notes,
        ReferredBy: addReferrals.ReferredBy,
        CoinRewards: addReferrals.CoinRewards,
        Status: addReferrals.id ? addReferrals.Status : "Pending"
      };

      const token = localStorage.getItem("token");
      const url = addReferrals?.id ? `${apiUrl}/updateReferral?Id=${addReferrals?.id}` : `${apiUrl}/createReferrals`;



      const response = addReferrals?.id ? await axios.put(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      }) : await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200)
      {
        setModalOpen(false);
        setLoading(false);
        toastr.success(`${response.data.message}`, '', { timeOut: 1000 });

      }
      setReferrals(null);
      setSelectedUserIndex(null);
      fetchData();

    } catch (error)
    {
      if (error?.response != null)
      {
        setLoading(false);
        toastr.error(`${error?.response.data.message ?? error?.response?.data}`, '', { timeOut: 1000 });
      }
    }
  };

  const handleEditUser = (userId, user) =>
  {

    setReferrals(user);
    setModalOpen(true);
  };
  const handleDeleteModalOpen = () => setDeleteModalOpen(true);

  const handleDeleteModalClose = () =>
  {
    setDeleteModalOpen(false);
    setSelectedUserId(null);
  };
  const handleDeleteUser = async () =>
  {

    try
    {
      if (selectedUserIndex !== null)
      {
        setLoading(true);

        const userIdToDelete = users[selectedUserIndex].id;

        const token = localStorage.getItem("token");

        const response = await axios.delete(
          `${apiUrl}/deleteReferral?referral_Id=${userIdToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200)
        {
          setDeleteModalOpen(false);
          setLoading(false);
          toastr.success(`${response.data.message}`, '', { timeOut: 1000 });

        }
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userIdToDelete)
        );
        setSelectedUserIndex(null);
        fetchData();
      }
    } catch (error)
    {
      if (error?.response != null)
      {
        setLoading(false);
        toastr.error(`${error?.response.data.message ?? error?.response?.data},'', { timeOut: 1000 }`);
      }
      else
      {
        setLoading(false);
        toastr.error(`${error}`, '', { timeOut: 1000 })
      }
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
                        <h3>Referrals</h3>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div class="col-sm-12">
                      <div class="text-right top_btn">
                        <div class="d-flex gap-x-2 justify-content-end">
                          <button onClick={handleOpen} class="rounded-pill btn btn-primary btn-xs m120" >Add New Referrals</button>
                          <button onClick={handleDeleteModalOpen} class="rounded-pill btn btn-danger btn-xs m120" disabled={selectedUserIndex === null}>Delete Referrals</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12">
                      <div className="table-container theme_table">
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
                                    style={{ width: "13px", height: "13px", margin-right: "4px" }}
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
                                    disabled={selectedUserIndex !== index}
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
      {loading && (
        <div className="loader_content">
          <img src="Spinner-1s-200px.svg" alt="Loading" />
        </div>
      )}
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
          width: "550px",
          margin: "auto",
          maxHeight: "90%",
          height: "auto",
        }}
      >

        <Modal.Header>
          <div className="modal-header">
            <span>{addReferrals?.id === undefined ? "Add Referrals " : "Edit Referrals"}</span>
            <button className="close_btn" onClick={handleClose} style={{ float: 'right' }}>
              &times;
            </button>
          </div>

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
                maxLength={10}
                value={addReferrals ? addReferrals.PhoneNumber : ""}
                // Update the value of the input with the corresponding user data
                onChange={(e) =>
                  setReferrals({ ...addReferrals, PhoneNumber: (/^[0-9]*$/.test(e.target.value)) ? e.target.value : '' })
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
            {addReferrals?.id !== undefined && <Form.Field>
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
                value={addReferrals ? addReferrals?.ReferredBy : ""}
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
                min={0}
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
              {addReferrals?.id === undefined ? "Save " : "Update"}
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
          width: "450px",
          margin: "auto",
          maxHeight: "50%",
          height: "auto",
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
