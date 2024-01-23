import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    
    debugger;
    try {
      if (!email.trim()) {
        setEmailError("Email feild required");
        return;
      }

      // Check if the password is not blank
      if (!password.trim()) {
        setPasswordError("Password feild required");
        return;
      }

      // Clear the email and password errors if they were previously set
      setEmailError("");
      setPasswordError("");
      const response = await axios.post("https://dev.nexmil.app/login", {
        Email: email,
        password: password,
      });
      console.log("Response Headers:", response.headers);
      
      const { token, message } = response.data;
      console.log("Login Successful. Token:", token);
      console.log("Message:", message);
      localStorage.setItem('token', token);
      // const handleButtonClick = () => toast("Wow so easy!");

      setEmail("");
      setPassword("");
       navigate('/dashboard');

    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      setError("Invalid email or password");
      console.error("Error:", error.message);
    }


    
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="container-fluid">
      <section className="vh-100">
        <div className="container h-100">
          <div className="row align-items-center mvh100">
            <div className="col col-xl-12">
              <div className="login_card">
              <div className="login_cardBody">
                      <form                       
                        action="/submit"
                        method="post"
                      >
                        {/* <div
                          className="d-flex align-items-center pb-1"
                        >
                          <div className="row">
                            <div className="col">
                              <i className="far fa-square fa-lg"></i>
                            </div>
                          </div>
                        </div>
                        <div
                          className="d-flex align-items-center pb-1">
                          <div className="row">
                            <div className="col">
                              <i className="far fa-square fa-lg"></i>
                              <i className="far fa-square fa-lg"></i>
                            </div>
                          </div>
                        </div>
                        <div
                          className="d-flex align-items-center mb-3 pb-1"
                        >
                          <span
                            className="h3 fw-semibold mb-0"
                          >
                            NEXMIL
                          </span>
                        </div> */}
                         <div className="form-group text-center">
                           <div className="d-flex justify-content-center align-items-center">
                              <img src="../../Login_logo.png" />
                          </div>
                        
                        </div>

                        <div className="form-group">
                           <div className="d-flex justify-content-between align-items-center">
                            <label className="form-label bold">
                              Email Address
                            </label>
                          </div>
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            onSubmit={handleLogin}
                            required
                          />
                          {emailError && <div className="text-danger">{emailError}</div>}
                        </div>
                        <div className="form-group">
                          <div className="d-flex justify-content-between align-items-center">
                            <label className="form-label bold">
                              Password
                            </label>
                            <div className="icon_password d-flex gap-2 align-items-center">
                              <i className="fas fa-eye-slash"></i>Hide
                            </div>
                          </div>
                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            onSubmit={handleLogin}  
                            required
                          />
                          {passwordError && <div className="text-danger">{passwordError}</div>}
                        </div>
                        {error && <div className="alert alert-danger mb-4">{error}</div>}

                        <div className="mb-4 text-center">
                          <button className="btn btn-success btn-block fw-bold" onClick={handleButtonClick} type="submit" >
                            Log In
                          </button>
                        </div>
                      </form>
                    </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
