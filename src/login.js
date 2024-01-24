import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import { jwtDecode } from "jwt-decode";

function Login()
{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const validateLoginData = () =>
  {
    let error = false;
    if (!email.trim())
    {
      error = true;
      toastr.error('Email field required', '', { timeOut: 1000 });

    }

    if (!password.trim())
    {
      error = true;
      toastr.error('Password field required', '', { timeOut: 1000 });
    }

    return error ?? false;
  };
  const handleLogin = async () =>
  {
    try
    {
      const isError = validateLoginData();

      if (isError)
      {
        return; // Validation failed, do not proceed with API request
      }
      const response = await axios.post("https://dev.nexmil.app/login", {
        Email: email,
        password: password,
      });

      const { token, message } = response.data;
      const { userName } = jwtDecode(token);
      //  const decoded = jwtDecode(token);
      // const decoded = jwt.decode(token);
      localStorage.setItem("userName", userName);
      localStorage.setItem("token", token);

      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (error)
    {

      if (error?.response != null)
      {

        toastr.error(`${error?.response.data.message ?? error?.response?.data}`, '', { timeOut: 1000 });
      }


      console.error("Error:", error.message);
    }
  };

  const handleButtonClick = (e) =>
  {
    e.preventDefault();
    handleLogin();
  };

  const togglePasswordVisibility = () =>
  {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  return (
    <div className="container-fluid">
      <section className="vh-100">
        <div className="container h-100">
          <div className="row align-items-center mvh100">
            <div className="col col-xl-12">
              <div className="login_card">
                <div className="login_cardBody">
                  <form action="/submit" method="post">
                    <div className="form-group text-center">
                      <div className="d-flex justify-content-center align-items-center">
                        <img src="../../Login_logo.png" alt="Logo" />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label bold">Email Address</label>
                      </div>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        onSubmit={handleLogin}
                        required
                      />
                      {/* {emailError && <div className="text-danger">{emailError}</div>} */}
                    </div>
                    <div className="form-group">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label bold">Password</label>
                        <div
                          className="icon_password d-flex gap-2 align-items-center"
                          onClick={togglePasswordVisibility}
                          style={{ cursor: "pointer" }}
                        >
                          <i
                            className={`fas ${passwordVisible ? "fa-eye" : "fa-eye-slash"
                              }`}
                          ></i>
                          {passwordVisible ? "Hide" : "Show"}
                        </div>
                      </div>
                      <input
                        type={passwordVisible ? "text" : "password"}
                        className="form-control"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        onSubmit={handleLogin}
                        required
                      />
                      {/* {passwordError && (
                        <div className="text-danger">{passwordError}</div>
                      )} */}
                    </div>
                    {error && (
                      <div className="alert alert-danger mb-4">{error}</div>
                    )}

                    <div className="mb-4 text-center">
                      <button
                        className="btn btn-success btn-block fw-bold"
                        onClick={handleButtonClick}
                        type="submit"
                      >
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
