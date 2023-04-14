import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Cookies from "js-cookie";
import AnimatedText from "react-animated-text-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
const Character = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // DESCRIPTION TOGGLE USESTATE
  const [isOpen, setIsOpen] = useState(false);

  const params = useParams();
  const id = params.id;
  //   console.log(id);

  // FAVOURITES USESTATE
  const [savedFav, setSavedFav] = useState(false);
  const [savedCom, setSavedCom] = useState();

  // USER USESTATES
  const [userId, setUserId] = useState();
  const token = Cookies.get("token");
  // console.log(token);

  // NAVIGATE
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4500/character/${id}`
        );
        // console.log(response.data);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchRelatedComics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4500/comics/character/${id}`
        );
        // console.log(response.data);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/user`);
        // console.log(response.data);
        const foundUser = response.data.user.find(
          (user) => user.token === token
        );
        setUserId(foundUser._id);
        if (token) {
          setSavedCom(foundUser.comics);
        }

        const favourite = foundUser.favourites.find((fav) => fav.id === id);
        if (favourite) {
          setSavedFav(true);
        }
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchUser();
    fetchCharacter();
    fetchRelatedComics();
  }, [id, token]);

  // console.log(savedFav);

  // IMAGE ERROR MANAGEMENT
  const imgPlaceholder =
    "https://t4.ftcdn.net/jpg/02/21/50/43/360_F_221504390_fjHkRmmJp0cRtiff6L0L5Gl8kZQIBzWh.jpg";

  const onImgError = (event) => {
    event.target.src = imgPlaceholder;
  };

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <main className="c-main">
      <section className="c-page">
        <Header setSavedFav={setSavedFav} setSavedCom={setSavedCom}></Header>
        {/* CHARACTER TITLE CONTAINER */}
        <section className="c-title-desc">
          <AnimatedText
            type="words" // animate words or chars
            animation={{
              x: "200px",
              y: "-20px",
              scale: 1.1,
              ease: "ease-in-out",
            }}
            animationType="lights"
            interval={0.06}
            duration={1}
            tag="p"
            className="c-name"
            includeWhiteSpaces
            threshold={0.1}
            rootMargin="20%"
          >
            {`${data.name} : related comics`}
          </AnimatedText>
          <AnimatedText
            type="words" // animate words or chars
            animation={{
              x: "200px",
              y: "-20px",
              scale: 1.1,
              ease: "ease-in-out",
            }}
            animationType="float"
            interval={0.01}
            duration={0.6}
            tag="p"
            className="ch-desc"
            includeWhiteSpaces
            threshold={0.1}
            rootMargin="20%"
          >
            {data.description
              ? `${data.description}`
              : `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos explicabo ullam expedita error. Cum, distinctio et! Doloribus similique repellat suscipit beatae, rem cumque ducimus et nihil asperiores omnis non. Omnis. Doloribus similique repellat suscipit beatae, rem cumque ducimus et nihil asperiores.`}
          </AnimatedText>
        </section>
        <section className="character-comic-container">
          <div className="ch-container">
            {data.thumbnail.path ===
            "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ? (
              <img
                className="ch-img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZfhR3FCR6J5wjX4ZGXRmq7tVH6crUjcw5D8dcekt_C4wPyjwZuiYiNmqVhAI9w0h6DO4&usqp=CAU"
              ></img>
            ) : (
              <img
                className="ch-img"
                src={data.thumbnail.path + "." + data.thumbnail.extension}
                alt="character"
              />
            )}
            {savedFav ? (
              <button
                className="fav-btn-ch"
                style={{ color: "gold" }}
                onClick={async () => {
                  try {
                    // console.log(userId);
                    const response = await axios.put(
                      `http://localhost:4500/user/deletefav/${userId}`,

                      {
                        id: data._id,
                        name: data.name,
                        image: data.image,
                      }
                    );

                    setData(data);
                    console.log(response);
                    setSavedFav(false);
                  } catch (error) {
                    console.log(error.response);
                  }
                }}
              >
                <FontAwesomeIcon icon="star" />
                <span> saved to favourites</span>
              </button>
            ) : (
              <button
                className="fav-btn-ch"
                onClick={async () => {
                  try {
                    const response = await axios.put(
                      `http://localhost:4500/user/update/${userId}`,

                      {
                        id: data._id,
                        name: data.name,
                        image:
                          data.thumbnail.path + "." + data.thumbnail.extension,
                      }
                    );
                    console.log(response);
                    setSavedFav(true);
                  } catch (error) {
                    console.log(error.message);
                    if ((error.response.data.message = "Missing parameters")) {
                      navigate("/login");
                    }
                  }
                }}
              >
                <FontAwesomeIcon icon="star" />
                <span> add to favourites</span>
              </button>
            )}
          </div>
          <div className="c-container">
            {data.comics.length === 0 ? (
              <p className="no-comics-info">
                Apologies, {data.name}'s related comics information is currently
                unavailable.{" "}
              </p>
            ) : (
              data.comics.map((comics) => {
                console.log(comics._id);
                const favCom =
                  token && savedCom.find((fav) => fav.id === comics._id);
                console.log(favCom);
                return (
                  <div>
                    <div className="c-card">
                      <div className="com-img-button">
                        {favCom ? (
                          <button
                            className="btn-com-gold"
                            layout="position"
                            onClick={async () => {
                              try {
                                // console.log(userId);
                                const response = await axios.put(
                                  `http://localhost:4500/user/deletecomic/${userId}`,

                                  {
                                    id: comics._id,
                                    name: comics.title,
                                    image: comics.image,
                                  }
                                );

                                setData(data);
                                console.log(response);
                                setSavedCom(response.data.comics);
                              } catch (error) {
                                console.log(error.response);
                              }
                            }}
                          >
                            <FontAwesomeIcon icon="star" />
                          </button>
                        ) : (
                          <button
                            className="btn-com"
                            layout="position"
                            onClick={async () => {
                              try {
                                const response = await axios.put(
                                  `http://localhost:4500/user/addcomic/${userId}`,

                                  {
                                    id: comics._id,
                                    name: comics.title,
                                    image:
                                      comics.thumbnail.path +
                                      "." +
                                      comics.thumbnail.extension,
                                  }
                                );
                                // console.log(response);
                                setSavedCom(response.data.comics);
                              } catch (error) {
                                console.log(error.message);
                                if (
                                  (error.response.data.message =
                                    "Missing parameters")
                                ) {
                                  navigate("/login");
                                }
                              }
                            }}
                          >
                            <FontAwesomeIcon icon="star" />
                          </button>
                        )}
                        <button
                          className="plus-btn-com"
                          onClick={() => {
                            navigate(`/comic/${comics._id}`);
                          }}
                        >
                          <FontAwesomeIcon icon="plus" />
                        </button>
                        {comics.thumbnail &&
                          comics.thumbnail.path &&
                          comics.thumbnail.extension &&
                          (comics.thumbnail.path ===
                          "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ? (
                            <img
                              layout="position"
                              className="c-img"
                              src={imgPlaceholder}
                              alt="character placeholder"
                            ></img>
                          ) : (
                            <img
                              layout="position"
                              className="c-img"
                              src={
                                comics.thumbnail.path +
                                "." +
                                comics.thumbnail.extension
                              }
                              alt="character"
                              onError={onImgError}
                            />
                          ))}
                      </div>

                      <div className="com-title-desc">
                        <p
                          onClick={() => {
                            setIsOpen(!isOpen);
                          }}
                          className="com-title"
                        >
                          {comics.title}
                        </p>
                        {isOpen && (
                          <div className="com-desc">
                            <AnimatedText
                              type="words" // animate words or chars
                              animation={{
                                x: "200px",
                                y: "-20px",
                                scale: 1.1,
                                ease: "ease-in-out",
                              }}
                              animationType="lights"
                              interval={0.01}
                              duration={0.1}
                              tag="p"
                              includeWhiteSpaces
                              threshold={0.1}
                              rootMargin="20%"
                            >
                              {comics.description
                                ? `${comics.description}`
                                : `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos explicabo ullam expedita error. Cum, distinctio et! Doloribus similique repellat suscipit beatae, rem cumque ducimus et nihil asperiores omnis non. Omnis. Doloribus similique repellat suscipit beatae, rem cumque ducimus et nihil asperiores.`}
                            </AnimatedText>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </section>
      {/* FOOTER */}
      <footer className="footer-ch"></footer>
    </main>
  );
};

export default Character;
