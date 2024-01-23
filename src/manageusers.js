import "semantic-ui-css/semantic.min.css";
import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import axios from "axios";
import DashboardHeader from "./dashboardHeader";
import TopHeader from "./topHeader";

function ManageUsers() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const handleDeleteModalOpen = () => setDeleteModalOpen(true);
  const handleDeleteModalClose = () => setDeleteModalOpen(false);
  const handleOpen = () => {
    
    setModalOpen(true);
    setEditingUser(null);

  }
  const handleCheckboxChange = (index) => {
    setSelectedUserIndex(index);
  };
  const handleDelete = async () => {
    debugger;
  
    try {
      if (selectedUserIndex !== null) {
        const userIdToDelete = users[selectedUserIndex].Id;
  
        const token = localStorage.getItem('token');
  
        const response = await axios.delete(`http://3.97.216.105:3000/deleteUser?Id=${userIdToDelete}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        console.log(JSON.stringify(response.data));
  
        setUsers((prevUsers) => prevUsers.filter((user) => user.Id !== userIdToDelete));
        setSelectedUserIndex(null);
        fetchData();
      } else {
        console.log('No user selected for deletion');
      }
    } catch (error) {
      console.error('Axios Error:', error);
      fetchData();

    }
  };
  const handleClose = () => setModalOpen(false);

  // const handleDeleteModalOpen = () => {
  //   setDeleteModalOpen()
  // };
  // const handleDeleteModalClose = () => {
  //   setEditingUser(null);
  //   setDeleteModalOpen(false);
  // };

  const fetchData = async () => {
    try {
      debugger;
      const token = localStorage.getItem( 'token');
      const response = await axios.get("http://3.97.216.105:3000/getUsers", {
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

  const fetchDataAsync = async () => {
    await fetchData();
  };

  useEffect(() => {
    // Use an asynchronous function within useEffect
   

    fetchDataAsync();
  }, []); 
  const accountTypes = [
    { key: "Super Administrator", text: " Super Administrator", value: "Super Administrator" },
    { key: "Admin", text: "Admin", value: "Admin" },
    { key: "User", text: "User", value: "User" },
   
  ];

  const handleEditUser = (userId,user) => {
    debugger
    setEditingUser(user);
    setModalOpen(true);
    // Perform the action you want when the edit icon is clicked
    console.log(`Editing user with ID: ${userId}`);
  };


  const handleSaveEdit = async () => {
    try {
      debugger;
  
      // if (!editingUser || (!editingUser.Id && editingUser.Id !== 0)) {
      //   // console.error("Invalid user or user ID");
      //   return;
      // }
  
      const data = {
        "Email": editingUser.Email,
        "Password": editingUser.Password,
        "FirstName": editingUser.FirstName,
        "LastName": editingUser.LastName,
        "AccountType": editingUser.AccountType,
      };
  
      const token = localStorage.getItem('token');
      const url = editingUser.Id ? `http://3.97.216.105:3000/updateUser?Id=${editingUser.Id}` : 'http://3.97.216.105:3000/register';
  
      const response = editingUser.Id
        ? await axios.put(url, data, { headers: { Authorization: `Bearer ${token}` } })
        : await axios.post(url, data, { headers: { Authorization: `Bearer ${token}` } });
  
      console.log(JSON.stringify(response.data));
  
      setModalOpen(false);
      setEditingUser(null);
      fetchData();
    } catch (error) {
      console.error("Save error:", error);
      // Handle error, show a message, or perform other actions as needed
      setModalOpen(false);
    }
  };

  return (
  <div className="container-fluid">
    <div className="vh-100">
        <div className="main_dashboard h-100">
          <div className="row">
            <div className="ui bottom attached segment pushable main_dashboardContent">
              <DashboardHeader/>
           
               <div className="pusher dashboard_rightSide">
        <TopHeader/>
                 <div className="page-content">
                   
                 
                    <div className="row">
                      <div className="col-sm-12">
                         <div className="card_title_heading">
                             <h3>Manage Users</h3>
                          </div>
                      </div>
                    </div>

                      <div className="row">
                        <div className="col-sm-12">
                          <div className="text-right top_btn">
                              <div className="d-flex gap-x-2 justify-content-end">
                                    <button onClick={handleOpen} className="rounded-pill btn btn-primary btn-xs m120" >Add New User</button>
                                    <button onClick={handleDeleteModalOpen} className="rounded-pill btn btn-danger btn-xs m120" >Delete</button>
                              
                              </div>
                             
                          </div>
                       </div>
                    </div>
                    <div  className="table-container theme_table">
                      <table className="ui celled table table-borderless" >
                        <thead>
                          <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Account Type</th>
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
                    onClick={() => handleEditUser(user.Id,user)}
                    style={{ backgroundColor: "transparent", border: "none" }}
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
        width: "380px",
        margin: "auto",
        maxHeight: "50%",
        height:"auto",
      }}
    >
      <Modal.Header>Add New User</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>First Name</label>
            <input placeholder="First Name"
            value={editingUser ? editingUser.FirstName : ""}
             onChange={(e) => setEditingUser({ ...editingUser, FirstName: e.target.value })} />
          </Form.Field>
          <Form.Field>
            <label>Last Name</label>
            <input placeholder="Last Name"
            value={editingUser ? editingUser.LastName : ""}
            onChange={(e) => setEditingUser({ ...editingUser, LastName: e.target.value })} />
          </Form.Field>
          <Form.Field>
          <label>Email</label>
          <input placeholder="Email"
            value={editingUser ? editingUser.Email : ""}
            // Update the value of the input with the corresponding user data
            onChange={(e) => setEditingUser({ ...editingUser, Email: e.target.value })} />
          </Form.Field>
          <Form.Field>
            <label>Account Type</label>
            <Dropdown
              placeholder="Select Account Type"
              fluid
              selection
              options={accountTypes}
              value={editingUser ? editingUser.AccountType : ""}
              onChange={(e, { value }) => setEditingUser({ ...editingUser, AccountType: value })}
            />
          </Form.Field>
          <Form.Field>
              <label>Password</label>
              <input
                placeholder="Password"
                value={editingUser ? editingUser.Password : ""}
                // Update the value of the input with the corresponding user data
                onChange={(e) => setEditingUser({ ...editingUser, Password: e.target.value })}
              />
            </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <div className="text-center">
          <Button color="blue" onClick={handleSaveEdit}>
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
        width: "380px",
        margin: "auto",
        maxHeight: "70%",
        height:"auto",
      }}
    >
      <Modal.Header>Delete User</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete the selected user?</p>
      </Modal.Content>
      <Modal.Actions>
        <div className="text-center">
          <Button color="grey" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete</Button>
        </div>
      </Modal.Actions>
    </Modal>

  </div>
    // <div className="container-fluid">
    //   <section className="vh-100">
    //     <div className="card">
    //       <div className="container h-100">
    //         <div className="container"></div>
    //         <div className="row justify-content-center align-items-center h-100">
    //           <div className="ui bottom attached segment pushable">
    //             <div
    //               className="ui visible inverted left vertical sidebar menu"
    //               style={{ width: "200px", height: "200%" }}
    //             >
    //               <a className="item">
    //                 <img
    //                   src="https://images.squarespace-cdn.com/content/v1/621e69b2decaaf78467e863e/510d2596-96f0-41a1-945c-1db03d85f05a/.png?format=300w"
    //                   alt="logo"
    //                 />
    //               </a>
    //               <Link to="/dashboard" className="item">
    //                 Dashboard
    //               </Link>
    //               <Link to="/manageusers" className="item">
    //                 Manage Users
    //               </Link>
    //               <Link to="/referrals" className="item">
    //                 Referrals
    //               </Link>
    //               <Link to="/redeemrequest" className="item">
    //                 Redeem Request
    //               </Link>
    //             </div>
    //             <div className="pusher">
    //               <div className="d-flex justify-content-between m-2">
    //                 <p>
    //                   Welcome, Francies
    //                   <div className="d-flex justify-content-between m-2">
    //                     <p>
    //                       <button
    //                         style={{
    //                           marginLeft: "430px",
    //                           color: "black",
    //                           fontWeight: "bold",
    //                         }}
    //                       >
    //                         LOG OUT
    //                       </button>
    //                     </p>
    //                   </div>
    //                 </p>
    //               </div>
    //               <div style={{ marginLeft: "50px" }}>
    //                 <button
    //                   onClick={handleOpen}
    //                   className="m-2"
    //                   style={{ backgroundColor: "skyblue", color: "white" }}
    //                 >
    //                   Add New User
    //                 </button>
    //                 <button onClick={handleDeleteModalOpen} style={{ backgroundColor: "red", color: "white" }}>
    //       Delete
    //     </button>
    //               </div>
    //               <div
    //                 className="table-container"
    //                 style={{ overflowX: "auto", maxWidth: "66%" }}
    //               >
    //                 <table
    //                   className="ui celled table"
    //                   style={{ fontSize: "10px" }}
    //                 >
    //                   <thead>
    //                     <tr>
    //                       <th>First Name</th>
    //                       <th>Last Name</th>
    //                       <th>Account Type</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     <tr>
    //                       <td>
    //                         <input
    //                           type="checkbox"
    //                           style={{ width: "13px", height: "13px" }}
    //                         />
    //                         John{" "}
    //                       </td>

    //                       <td>Doe</td>
    //                       <td>Super Administrator</td>
    //                       <td>
    //                         <span style={{ marginLeft: "3px" }}>
    //                           <i className="fas fa-edit"></i>
    //                         </span>
    //                       </td>
    //                     </tr>
    //                     <tr>
    //                       <td>
    //                         <input
    //                           type="checkbox"
    //                           style={{ width: "13px", height: "13px" }}
    //                         />
    //                         Emma{" "}
    //                       </td>
    //                       <td>Wastson</td>
    //                       <td>Guest</td>

    //                       <span style={{ marginLeft: "3px" }}>
    //                         <i className="fas fa-edit"></i>
    //                       </span>
    //                     </tr>
    //                     <tr>
    //                       <td>
    //                         <input
    //                           type="checkbox"
    //                           style={{ width: "13px", height: "13px" }}
    //                         />
    //                         Bob{" "}
    //                       </td>
    //                       <td>Sap</td>
    //                       <td>Administrator</td>
    //                       <span style={{ marginLeft: "3px" }}>
    //                         <i className="fas fa-edit"></i>
    //                       </span>
    //                     </tr>
    //                     <tr>
    //                       <td>
    //                         <input
    //                           type="checkbox"
    //                           style={{ width: "13px", height: "13px" }}
    //                         />
    //                         Frank{" "}
    //                       </td>
    //                       <td>Tank</td>
    //                       <td>Guest</td>
    //                       <span style={{ marginLeft: "3px" }}>
    //                         <i className="fas fa-edit"></i>
    //                       </span>
    //                     </tr>
    //                     <tr>
    //                       <td>
    //                         <input
    //                           type="checkbox"
    //                           style={{ width: "13px", height: "13px" }}
    //                         />
    //                         Rolanda{" "}
    //                       </td>
    //                       <td>MCDonald</td>
    //                       <td>VIP</td>
    //                       <span style={{ marginLeft: "3px" }}>
    //                         <i className="fas fa-edit"></i>
    //                       </span>
    //                     </tr>
    //                     <tr>
    //                       <td>
    //                         <input
    //                           type="checkbox"
    //                           style={{ width: "13px", height: "13px" }}
    //                         />
    //                         Johnny{" "}
    //                       </td>
    //                       <td>Orackers</td>
    //                       <td>VIP</td>
    //                       <span style={{ marginLeft: "3px" }}>
    //                         <i className="fas fa-edit"></i>
    //                       </span>
    //                     </tr>
    //                   </tbody>
    //                 </table>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   <Modal
    //     open={deleteModalOpen}
    //     onClose={handleDeleteModalClose}
    //     closeOnDimmerClick={false}
    //     closeOnDocumentClick={false}
    //     size="mini"
    //     style={{
    //       top: "50%",
    //       left: "50%",
    //       transform: "translate(-50%, -50%)",
    //       width: "300px",
    //       margin: "auto",
    //       maxHeight: "50%",
    //     }}
    //   >
    //     <Modal.Header>Add New User</Modal.Header>
    //     <Modal.Content>
    //       <Form>
    //         <Form.Field>
    //           <label>First Name</label>
    //           <input placeholder="First Name" />
    //         </Form.Field>
    //         <Form.Field>
    //           <label>Last Name</label>
    //           <input placeholder="Last Name" />
    //         </Form.Field>
    //         <Form.Field>
    //           <label>Account Type</label>
    //           <Dropdown
    //             placeholder="Select Account Type"
    //             fluid
    //             selection
    //             options={accountTypes}
    //           />
    //         </Form.Field>
    //       </Form>
    //     </Modal.Content>
    //     <Modal.Actions>
    //       <Button color="blue" onClick={handleClose}>
    //         Save
    //       </Button>
    //     </Modal.Actions>
    //   </Modal>

    //   {/* Delete Modal */}


    //   <Modal
    //     open={deleteModalOpen}
    //     onClose={handleDeleteModalClose}
    //     size="mini"
    //     style={{
    //       top: "50%",
    //       left: "50%",
    //       transform: "translate(-50%, -50%)",
    //       width: "300px",
    //       margin: "auto",
    //       maxHeight: "70%",
    //     }}
    //   >
    //     <Modal.Header>Delete User</Modal.Header>
    //     <Modal.Content>
    //       <p>Are you sure you want to delete the selected user?</p>
    //     </Modal.Content>
    //     <Modal.Actions>
    //       <Button color="grey" onClick={handleDeleteModalClose}>
    //         Cancel
    //       </Button>
    //       <Button color="red" onClick={handleDeleteModalClose}>
    //         Delete
    //       </Button>
    //     </Modal.Actions>
    //   </Modal>

    // </div>
  );
}

export default ManageUsers;
