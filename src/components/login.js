import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import logoImage from "../logo/logo.jpeg";
import config from "../config";

const Login = () => {
  const history = useHistory();

  const [loginData, setLoginData] = useState({
    loginIdentifier: "",
    password: "",
  });

  const [alertMessage, setAlertMessage] = useState(null);
  const [color, setColor] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    // Clear error for this input field if user starts typing
    setErrors({ ...errors, [name]: false });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!loginData.loginIdentifier) {
      newErrors.loginIdentifier = true;
    }
    if (!loginData.password) {
      newErrors.password = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        setErrors({});
      }, 1000);
      setIsButtonDisabled(false);
      return;
    }

    setIsButtonDisabled(true);
    try {
      const response = await axios.post(
        `${config.apiUrl}/user/login`,
        loginData
      );
      if (response.data.status === 200) {
        setAlertMessage("✅Login Successful!");
        setColor(true);
        setTimeout(() => {
          setAlertMessage(null);
          localStorage.setItem("user", JSON.stringify(response.data.data));
          history.push("/sidebar");
          setIsButtonDisabled(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "Invalid username or password") {
          setAlertMessage("Invalid username or password");
        } else if (errorMessage === "Invalid username") {
          setAlertMessage("Invalid username or password");
        } else if (errorMessage === "Invalid password") {
          setAlertMessage("Invalid password.");
        } else {
          setAlertMessage("Invalid username or password");
        }
        setTimeout(() => {
          setAlertMessage(null);
          setIsButtonDisabled(false);
        }, 2000);
      } else {
        console.error("An unexpected error occurred:", error);
        setAlertMessage("An unexpected error occurred. Please try again.");
        setTimeout(() => {
          setAlertMessage(null);
        }, 2000);
      }
    }
  };

  const alertStyle = {
    position: "fixed",
    top: "10px",
    left: "80%",
    transform: "translateX(-50%)",
    backgroundColor: color ? "green" : "red",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
    zIndex: "9999",
    display: alertMessage ? "block" : "none",
    opacity: alertMessage ? 1 : 0,
    transition: "opacity 0.5s ease-in-out",
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url('../Assets/bg.jpg')`,
        backgroundSize: "100% 100%",
        minHeight: "100vh",
        backgroundRepeat: "no-repeat",
        fontFamily: "serif",
      }}
    >
      <style>
        {`
        .border-red-500{
          border: 2px solid red;
        }
        `}
      </style>
      <div style={{ marginLeft: "750px" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'20px' }}>
          <img
            src={logoImage}
            alt="Profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
            }}
          />
          <div style={{ textAlign: 'center', marginLeft: '20px' }}>
            <h2 style={{ color: 'white', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)', fontWeight: 'bold', fontSize: '34px' }}>LINGA DENTAL CARE</h2>
            <p style={{ color: 'white', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)' }}>ALWAYS SMILE BRIGHT</p>
          </div>
        </div>

        <div style={alertStyle}>{alertMessage}</div>
        <div className="ml-24">
          <div
            className="circle-container"
            style={{
              width: "300px", 
              height: "300px", 
              borderRadius: "50%",
              background: "linear-gradient(to bottom right, #87CEEB, #008080)", 
              boxShadow: "0px 0px 20px 5px rgba(255, 255, 255, 1)", 
            }}
          >
            <form style={{ padding: "50px" }}>
              <div className="mb-3">
                <label htmlFor="loginIdentifier" className="form-label text-white">
                  <b>Email/Mobile number</b>
                </label>
                <input
                  type="text"
                  id="loginIdentifier"
                  name="loginIdentifier"
                  placeholder="Email or Mobile Number"
                  className={` form-control ${errors.loginIdentifier ? 'border-red-500' : 'border-gray-300'}`}
                  value={loginData.loginIdentifier}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label text-white">
                  <b>Password</b>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className={`form-control ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  value={loginData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="btn text-2xl text-white"
                  disabled={isButtonDisabled}
                  onClick={handleLogin}
                  style={{
                    width: "100px", 
                    height: "100px", 
                    borderRadius: "50%",
                    background: "linear-gradient(to bottom right, #87CEEB, #008080)", 
                    boxShadow: "0px 0px 20px 5px rgba(255, 255, 255, 1)", 
                    marginLeft:'100px'
                  }}
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
