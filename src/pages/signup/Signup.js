import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/header/Header";
//Cookies
import Cookies from "js-cookie";

const Signup = () => {
  //SIGNUP INPUT USESTATES
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //ERROR MESSAGE USESTATES
  const [errorMessage, setErrorMessage] = useState("");

  // TOKEN MANAGEMENT
  const [token, setToken] = useState(Cookies.get("token") || null);

  if (token) {
    console.log("token exists");
  }

  const handleToken = (token) => {
    if (token) {
      setToken(token);
      Cookies.set("token", token, { expires: 10 });
    } else {
      setToken(null);
      Cookies.remove("token");
    }
  };

  // onChange Input Handlers
  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  // Navigate
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setErrorMessage("");
    try {
      if (password !== confirmPassword) {
        return setErrorMessage("Your passwords don't match.");
      }
      const formData = new FormData();
      formData.append("username", userName);
      formData.append("email", email);
      formData.append("password", password);

      console.log(formData);
      const response = await axios.post(
        "https://site--marvel-backend--phfc9s47kbj5.code.run/signup",
        // "http://localhost:4500/signup",
        formData
      );
      console.log(response.data);
      const token = response.data.token;
      console.log(token);

      if (token) {
        handleToken(token);
        navigate("/characters");
      }
    } catch (error) {
      console.log(error.response.data);
      console.log(error.response.status);
      if (error.response.data.message === "This email already has an account") {
        setErrorMessage("This e-mail already exists.");
      }
      if ((error.response.data.message = "Missing parameters")) {
        setErrorMessage(
          "We are missing information to sign you up. Please fill in all the fields above."
        );
      }
    }
  };

  return (
    <main className="signup-main">
      <section className="signup-page">
        <Header></Header>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <div className="signup-container">
            <div className="img-box"></div>
            <div className="signup-box">
              <h1>CREATE AN ACCOUNT</h1>
              <input
                className="input-box"
                type="text"
                placeholder="Username"
                onChange={handleUserNameChange}
                value={userName}
              />
              <input
                className="input-box"
                type="email"
                placeholder="Email"
                onChange={handleEmailChange}
                value={email}
              />
              <input
                className="input-box"
                type="password"
                placeholder="Password"
                onChange={handlePasswordChange}
                value={password}
              />
              <input
                className="input-box"
                type="password"
                placeholder="Confirm password"
                onChange={handleConfirmPasswordChange}
                value={confirmPassword}
              />

              <button>Sign up</button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <span
                className="connect-here"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Already have an account? Click here to log in!
              </span>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Signup;
