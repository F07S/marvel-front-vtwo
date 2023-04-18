// HEADER IMPORT
import Header from "../../components/header/Header";

// ACTIVITY INDICATOR LIBRARY IMPORT
import Bounce from "react-activity/dist/Bounce";
import "react-activity/dist/library.css";

// VECTOR ICON IMPORT
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// AXIOS IMPORT
import axios from "axios";

// REACT ELEMENTS IMPORT
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//COOKIES PACKAGE IMPORT
import Cookies from "js-cookie";

const Favourites = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // USER DATA STATES
  const [userId, setUserId] = useState();

  // USER TOKEN
  const token = Cookies.get("token");
  console.log(token);

  // NAVIGATE
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/user`);
        console.log(response.data);
        const foundUser = response.data.user.find(
          (user) => user.token === token
        );
        setData(foundUser);
        setUserId(foundUser._id);
        console.log(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchFavourites();
  }, []);

  return (
    <main className="fav-main">
      {token ? (
        <section className="fav-page">
          <Header></Header>

          {isLoading ? (
            <div className="activity-ch-page">
              <Bounce className="activity-ind-ch-page" />
            </div>
          ) : (
            <>
              <p className="fav-title">MY COMIC BOOK CHARACTER COLLECTION</p>
              <section className="fav-container">
                {data.favourites.length === 0 ? (
                  <p className="no-fav-info">
                    Your comic book character collection is empty.
                  </p>
                ) : (
                  data.favourites.map((fav) => {
                    console.log(fav);
                    return (
                      <div className="fav-card" key={fav._id}>
                        <div className="img-btn">
                          <button
                            className="trash-btn"
                            onClick={async () => {
                              try {
                                console.log(userId);
                                const response = await axios.put(
                                  `http://localhost:4500/user/deletefav/${userId}`,

                                  {
                                    id: fav.id,
                                    name: fav.name,
                                    image: fav.image,
                                  }
                                );
                                const responseUpdate = await axios.get(
                                  `http://localhost:4500/user`
                                );
                                console.log(responseUpdate.data);
                                const foundUser = responseUpdate.data.user.find(
                                  (user) => user.token === token
                                );
                                setData(foundUser);
                                console.log(response);
                              } catch (error) {
                                console.log(error.response);
                              }
                            }}
                          >
                            <FontAwesomeIcon icon="trash-can" />
                          </button>
                          <button
                            className="plus-btn"
                            onClick={() => {
                              navigate(`/character/${fav.id}`);
                            }}
                          >
                            <FontAwesomeIcon icon="plus" />
                          </button>
                          {fav.image ===
                          "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ? (
                            <img
                              className="fav-img"
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZfhR3FCR6J5wjX4ZGXRmq7tVH6crUjcw5D8dcekt_C4wPyjwZuiYiNmqVhAI9w0h6DO4&usqp=CAU"
                              alt="character placeholder"
                            ></img>
                          ) : (
                            <img
                              className="fav-img"
                              src={fav.image}
                              alt="character"
                            />
                          )}
                          {/* <img className="fav-img" src={fav.image} alt="" /> */}
                        </div>
                        <p className="fav-name">{fav.name}</p>
                      </div>
                    );
                  })
                )}
              </section>
              <p className="fav-title">MY COMIC BOOK COLLECTION</p>
              <section className="fav-container">
                {data.comics.length === 0 ? (
                  <p className="no-fav-info">
                    Your comic book collection is empty.
                  </p>
                ) : (
                  data.comics.map((fav) => {
                    // console.log(fav);
                    return (
                      <div className="fav-card" key={fav._id}>
                        <div className="img-btn">
                          <button
                            className="trash-btn"
                            onClick={async () => {
                              try {
                                console.log(userId);
                                const response = await axios.put(
                                  `http://localhost:4500/user/deletecomic/${userId}`,

                                  {
                                    id: fav.id,
                                    name: fav.name,
                                    image: fav.image,
                                  }
                                );
                                const responseUpdate = await axios.get(
                                  `http://localhost:4500/user`
                                );
                                console.log(responseUpdate.data);
                                const foundUser = responseUpdate.data.user.find(
                                  (user) => user.token === token
                                );
                                setData(foundUser);
                                console.log(response);
                              } catch (error) {
                                console.log(error.response);
                              }
                            }}
                          >
                            <FontAwesomeIcon icon="trash-can" />
                          </button>
                          <button
                            className="plus-btn"
                            onClick={() => {
                              navigate(`/comic/${fav.id}`);
                            }}
                          >
                            <FontAwesomeIcon icon="plus" />
                          </button>
                          {fav.image ===
                          "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ? (
                            <img
                              className="fav-img"
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZfhR3FCR6J5wjX4ZGXRmq7tVH6crUjcw5D8dcekt_C4wPyjwZuiYiNmqVhAI9w0h6DO4&usqp=CAU"
                              alt="character placeholder"
                            ></img>
                          ) : (
                            <img
                              className="com-img"
                              src={fav.image}
                              alt="character"
                            />
                          )}
                          {/* <img className="fav-img" src={fav.image} alt="" /> */}
                        </div>
                        <p className="fav-name">{fav.name}</p>
                      </div>
                    );
                  })
                )}
              </section>
            </>
          )}
        </section>
      ) : (
        navigate("/login")
      )}

      {/* FOOTER */}
      <footer className="footer-fav"></footer>
    </main>
  );
};

export default Favourites;
