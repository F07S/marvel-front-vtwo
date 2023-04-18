import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../../components/header/Header";
const Login = () => {
  //LOGIN INPUT USESTATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Navigate
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://site--marvel-backend--phfc9s47kbj5.code.run/login",
        // "http://localhost:4500/login",

        {
          email: email,
          password: password,
        }
      );
      console.log(response.data.token);
      const token = response.data.token;

      if (token) {
        handleToken(token);
        navigate("/characters");
      }
    } catch (error) {
      console.log(error.response.data);
      console.log(error.response.status);

      if ((error.response.data.message = "Unauthorized")) {
        setErrorMessage(
          "The e-mail and/or password are not valid. Please try again."
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
            handleLogin();
          }}
        >
          <div className="signup-container">
            <div className="img-box-login"></div>
            <div className="signup-box">
              <h1>Log in</h1>

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

              <button>Log in</button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <span
                className="connect-here"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Not a member yet ? Sign up here!
              </span>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
