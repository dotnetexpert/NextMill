import "semantic-ui-css/semantic.min.css";
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import DashboardHeader from "./dashboardHeader";
import TopHeader from "./topHeader";
function Referrals() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleDeleteModalOpen = () => setDeleteModalOpen(true);
  const handleDeleteModalClose = () => setDeleteModalOpen(false);

  const accountTypes = [
    { key: "admin", text: "Administrator", value: "Administrator" },
    { key: "guest", text: "Guest", value: "Guest" },
    { key: "vip", text: "VIP", value: "VIP" },
  ];


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
                              <h3>Referrals</h3>
                            </div>
                        </div>
                      </div>

                      <div className="row">
                          <div className="col-sm-12">
                            <div className="text-right top_btn">
                                <div className="d-flex gap-x-2 justify-content-end">
                                      <button onClick={handleOpen} className="rounded-pill btn btn-primary btn-xs m120" >Add New Referrals</button>
                                      <button onClick={handleDeleteModalOpen} className="rounded-pill btn btn-danger btn-xs m120" >Delete Referrals</button>
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
                                <th>Referralsby:</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <div className="d-flex gap-x-2 align-items-center">
                                    <input type="checkbox" style={{ width: "13px", height: "13px" }}/>
                                    John{" "}
                                  </div>
                                </td>
                                <td>Doe</td>
                                <td>222 111 554</td>
                                <td>This is a note</td>
                                <td>John Doe</td>
                                <td><i>Pending</i></td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="d-flex gap-x-2 align-items-center">
                                    <input type="checkbox" style={{ width: "13px", height: "13px" }}/>
                                    Emma{" "}
                                  </div>
                                </td>
                                <td>Wastson</td>
                                <td>Guest</td>
                                <td>519 222 333</td>
                                <td> </td>
                                <td><i>Approved</i></td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="d-flex gap-x-2 align-items-center">
                                    <input type="checkbox" style={{ width: "13px", height: "13px" }}/>
                                      Bob{" "}
                                    </div>
                                </td>
                                <td>Sap</td>
                                <td>222 333 444</td>
                                <td>This is a note</td>
                                <td>Emma waston</td>
                                <td><i>Pending</i></td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="d-flex gap-x-2 align-items-center">
                                    <input type="checkbox" style={{ width: "13px", height: "13px" }}/>
                                    Frank{" "}
                                  </div>
                                </td>
                                <td>Tank</td>
                                <td>111 222 555</td>
                                <td> </td>
                                <td>Emma Moe</td>
                                <td><i>Approved</i></td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="d-flex gap-x-2 align-items-center">
                                    <input type="checkbox" style={{ width: "13px", height: "13px" }}/>
                                    Rolanda{" "}
                                  </div>
                                </td>
                                <td>MCDonald</td>
                                <td>111 666 777</td>
                                <td>John</td>
                                <td>Emma Moe</td>
                                <td><i>Pending</i></td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="d-flex gap-x-2 align-items-center">
                                    <input type="checkbox" style={{ width: "13px", height: "13px" }}/>
                                      Johnny{" "}
                                  </div>
                                </td>
                                <td>Orackers</td>
                                <td>555 666 777</td>
                                <td>This is a note</td>
                                <td>Emma Moe </td>
                                <td><i>Approved</i></td>
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
          width: "380px",
          margin: "auto",
          maxHeight: "90%",
          height:"auto",
        }}
      >
        <Modal.Header>Referrals</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>First Name</label>
              <input placeholder="First Name" />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <input placeholder="Last Name" />
            </Form.Field>
            <Form.Field>
              <label>Phone #</label>
              <input placeholder="Phone #" />
            </Form.Field>
            <Form.Field>
              <label>Notes</label>
              <input placeholder="Notes" />
            </Form.Field>
            <Form.Field>
              <label>Status</label>
              <Dropdown
                placeholder="Select Status"
                fluid
                selection
                options={[
                  { key: "pending", text: "Pending", value: "Pending" },
                  { key: "approved", text: "Approved", value: "Approved" },
                ]}
              />
            </Form.Field>
            <Form.Field>
              <label>Attribute Referrals to:</label>
              <Dropdown
                placeholder="Attribute Referrals to:"
                fluid
                selection
                options={accountTypes}
              />
            </Form.Field>
            <Form.Field>
              <label>Events=coln Rewards</label>
              <input placeholder="VIP" />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <div className="text-center">
              <Button color="blue" onClick={handleClose}>
                Save
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
          width: "300px",
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
          <Button color="red" onClick={handleDeleteModalClose}>
            Delete
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default Referrals;
