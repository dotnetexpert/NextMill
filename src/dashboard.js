import React from "react";
import { useState } from "react";
import { Grid, GridRow, GridColumn } from "semantic-ui-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect } from "react";
import "./dashboard.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import DashboardHeader from "./dashboardHeader";
import TopHeader from "./topHeader";

// const getChartOptions = () => {
//   return {
//     chart: {
//       type: "column",
//       height: 220,
//       // width: 225,
//       backgroundColor: "",
//     },
//     title: {
//       text: "",
//       align: "left",
//     },
//     xAxis: {
//       categories: [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//       ],
//       crosshair: true,
//       title: {
//         text: "",
//       },
//       accessibility: {},
//     },
//     yAxis: {
//       min: 0,
//       title: {
//         text: "",
//       },
//     },
//     tooltip: {
//       valueSuffix: " ",
//     },
//     plotOptions: {
//       column: {
//         pointPadding: -0.1,
//         borderWidth: 0.2,
//         color: "#0b44ff",
//       },
//       series: {
//         showInLegend: false,
//         dataLabels: {
//           enabled: true,
//         },
//       },
//     },
//     series: [
//       {
//         name: "",
//         data: [45, 36, 40, 22, 34, 45, 40],
//       },
//     ],
//   };
// };

function Dashboard()
{

  const navigate = useNavigate();
  const [userCounts, setUserCounts] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() =>
  {

    fetchData();

    fetchDatas();
  }, []);

  const fetchData = async () =>
  {
    try
    {

      const token = localStorage.getItem("token");
      // Make a request to your backend API with the authentication token
      const response = await axios.get("https://dev.nexmil.app/all-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assuming the response contains user count data
      const { userCountByMonth } = response.data;

      // Update the state with the received data
      setUserCounts(userCountByMonth);
    } catch (error)
    {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchDatas = async () =>
  {
    try
    {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://dev.nexmil.app/monthly-referrals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChartData(response.data.resultArray);
    } catch (error)
    {
      console.error('Error fetching data from API:', error);
    }
  };

  const categoriesArray = chartData?.map((item) => item.month);
  const dataArray = chartData?.map((item) => item.count);


  const columnChartOptions = {
    chart: {
      type: "column",
      height: "230",
      width: "380",
      backgroundColor: "",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: categoriesArray,

      lineWidth: 0,
    },
    yAxis: {
      stackLabels: {
        enabled: true,
      },
      // tickPositions: [10, 20, 30, 40, 50],
      title: {
        text: "",
      },
      visible: false,
    },
    legend: false,

    colors: ["#0000FF"],
    series: [
      {
        dataLabels: {
          enabled: true,
        },
        name: "",

        data: dataArray,
      },
    ],
  };

  return (
    <div className="container-fluid">
      <div className="vh-100">
        <div className="main_dashboard h-100">
          <div className="row">
            <div className="ui bottom attached segment pushable main_dashboardContent">
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
              <DashboardHeader />

              <div className="pusher dashboard_rightSide">

                <TopHeader />
                <div className="page-content">
                  <div className="">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="card card-height-100 grid-margin bg-grey border0">
                          <div className="card_title_heading">
                            <h3>Monthly Referrals</h3>
                          </div>
                          <div className="card-body">
                            <div className="d-flex justify-content-center">
                              <HighchartsReact
                                highcharts={Highcharts}
                                options={columnChartOptions}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="card card-height-100 grid-margin bg-grey border0">
                          <div className="card_title_heading">
                            <h3>Total Users</h3>
                          </div>
                          <div className="card-body">
                            <div className="total-users-data">
                              <ul className="cal_center">
                                {Object.entries(userCounts).map(
                                  ([monthYear, count]) => (
                                    <li key={monthYear} className="m-1">
                                      <span>{monthYear}</span>{" "}
                                      <span className="number" style={{ color: "blue" }}>
                                        {count}
                                      </span>
                                    </li>
                                  )
                                )}         </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6">
                        <div className="card card-height-100 grid-margin bg-grey border0 totalItemRedeem">
                          <div className="card_title_heading">
                            <h3>Total Item Redeemed</h3>
                          </div>
                          <div className="card-body">
                            <div className="total-users-data">
                              <ul className="">
                                <li>
                                  <span className="f16"><b>July 2023</b></span>
                                </li>
                                <li>
                                  <span>White Bucket Hat</span>
                                  <span className="number" style={{ color: "#0b44ff" }}>11</span>
                                </li>
                                <li>
                                  <span>Black Bucket Hat</span>
                                  <span className="number" style={{ color: "#0b44ff" }}>6</span>
                                </li>
                                <li>
                                  <span>Toronto Maple Leals Jersay</span>
                                  <span className="number" style={{ color: "#0b44ff" }}>9</span>
                                </li>
                                <li>
                                  <span>Toronto Blue Jays Hat</span>
                                  <span className="number" style={{ color: "#0b44ff" }}>3</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="card card-height-100 grid-margin bg-grey border0">
                          <div className="card_title_heading">
                            <h3>Total product Redeemed</h3>
                          </div>
                          <div className="card-body">
                            <div className="total-users-data">
                              <ul className="cal_center">
                                <li>
                                  <span>July 2023</span>
                                  <span className="number" style={{ color: "#0b44ff" }}>23</span>
                                </li>
                                <li>
                                  <span>Aug 2023</span>
                                  <span className="number" style={{ color: "#0b44ff" }}>24</span>
                                </li>
                                <li>
                                  <span>Sept 2023</span>
                                  <span className="number" style={{ color: "#0b44ff" }}>26</span>
                                </li>
                                <li>
                                  <span>Oct 2023</span>
                                  <span className="number" style={{ color: "#0b44ff" }}>28</span>
                                </li>
                                <li>
                                  <span>Nov 2023</span>
                                  <span className="number" style={{ color: "#0b44ff" }}>30</span>
                                </li>
                              </ul>
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
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
