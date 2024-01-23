import React from "react";
import { Grid, GridRow, GridColumn } from "semantic-ui-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./dashboard.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Link } from "react-router-dom";



function TopHeader() {

  const navigate = useNavigate();

  const logoutclick = async () => {
    debugger;
    try {
    
      // Make a request to your logout endpoint on the server
      // const response = await axios.post('http://localhost:3000/logout');
debugger
      localStorage.removeItem("token");
      // Assuming the response includes a success message
      // const { message } = response.data;
      // console.log("Message:", message);
      // Clear any user-related data (e.g., tokens, session information)

        

      // Navigate to the login page after successful logout
       navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);

      // Show an error toast
      // toast.error('Logout failed', {
      //   position: 'top-center',
      //   autoClose: 3000,
      //   hideProgressBar: true,
      // });
    }
  };

  return (
    <div className="d-flex justify-content-between w100 dashboard_rightTopbar">
    <div className="topHeading"><p>Welcome, Francies</p></div>
      <div className="d-flex justify-content-between">
         <button className="linkBtn bg-transparent border0" onClick={logoutclick}>
             LOG OUT
           </button>
       </div>
   </div>
  );
}

export default TopHeader;
