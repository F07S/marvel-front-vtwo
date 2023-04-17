import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";

const Header = ({ setSavedFav, setSavedCom }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  // NAVIGATE
  const navigate = useNavigate();

  // TOKEN MANAGEMENT
  const [token, setToken] = useState(Cookies.get("token") || null);
  const handleToken = (token) => {
    if (token) {
      setToken(token);
      Cookies.set("token", token, { expires: 10 });
    } else {
      setToken(null);
      Cookies.remove("token");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/user`);
        // console.log(response.data.user);
        setData(response.data.user);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchUsers();
  }, []);

  return (
    <header>
      <img
        className="logo"
        src="https://lereacteur-marvel-api.netlify.app/static/media/logo.ad6c786b.svg"
        alt=""
      />
      <nav>
        <div
          onClick={() => {
            navigate("/characters");
          }}
          className="btn-icon-header"
        >
          <FontAwesomeIcon className="header-icon" icon="mask" />
          <button>CHARACTERS</button>
        </div>
        <div
          onClick={() => {
            navigate("/comics");
          }}
          className="btn-icon-header"
        >
          <FontAwesomeIcon className="header-icon" icon="book" />
          <button>COMICS</button>
        </div>
        <div
          onClick={() => {
            token ? navigate("/favourites") : navigate("/login");
          }}
          className="btn-icon-header"
        >
          <FontAwesomeIcon className="header-icon" icon="star" />
          <button>FAVOURITES</button>
        </div>

        {token ? (
          <div
            onClick={() => {
              handleToken(null);
              navigate("/login");
            }}
            className="btn-icon-header"
          >
            <FontAwesomeIcon
              className="header-icon"
              icon="right-from-bracket"
            />
            <button>LOG OUT</button>
          </div>
        ) : (
          <div
            onClick={() => {
              navigate("/signup");
            }}
            className="btn-icon-header"
          >
            <FontAwesomeIcon className="header-icon" icon="user" />
            <button>SIGN IN</button>
          </div>
        )}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          token &&
          data.map((user) => {
            return (
              token === user.token && (
                <div className="btn-icon-header-user">
                  <button>
                    <p>Welcome {user.username}</p>
                  </button>
                </div>
              )
            );
          })
        )}
      </nav>
    </header>
  );
};

export default Header;
