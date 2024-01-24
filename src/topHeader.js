import React from "react";
import "./dashboard.css";
import { useNavigate } from 'react-router-dom';



function TopHeader()
{

  const navigate = useNavigate();

  const logoutclick = async () =>
  {
    try
    {
      localStorage.removeItem("token");
      navigate('/login');
    } catch (error)
    {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="d-flex justify-content-between w100 dashboard_rightTopbar">
      <div className="topHeading"><p>{`Welcome,${localStorage.getItem("userName")}`}</p></div>
      <div className="d-flex justify-content-between">
        <button className="linkBtn bg-transparent border0" onClick={logoutclick}>
          LOG OUT
        </button>
      </div>
    </div>
  );
}

export default TopHeader;
