import Header from "../../components/header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import LinesEllipsis from "react-lines-ellipsis";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

// POP-UP NOTIFICATIONS PACKAGE
//################################################################################################
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Characters = () => {
  // DATA USESTATE
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // PAGINATION USESTATES
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState();

  // SEARCH USESATE
  const [search, setSearch] = useState("");

  // DESCRIPTION TOGGLE USESTATE
  const [isOpen, setIsOpen] = useState(false);

  // USER MANAGEMENT & USESTATE
  const [userId, setUserId] = useState();
  const token = Cookies.get("token");

  // FAVOURITES USESTATE
  const [savedFav, setSavedFav] = useState(false);

  // NAVIGATE
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4500/characters?name=${search}&skip=${skip}`
        );

        setCount(response.data.count);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/user`);
        const foundUser = response.data.user.find(
          (user) => user.token === token
        );
        setUserId(foundUser._id);
        setSavedFav(foundUser.favourites);
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchUser();
    fetchData();
  }, [search, skip, token]);

  // SEARCH MANAGEMENT
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setSkip(0);
  };

  // PAGINATION MANAGEMENT
  const numberOfPages = Math.ceil(count / 100);
  const handlePageClick = (event) => {
    setSkip(event.selected * 100);
  };

  return (
    <main className="characters-main">
      <section className="characters-page">
        <Header setSavedFav={setSavedFav}></Header>
        {/* TITLE SEARCH CONTAINER */}
        <section className="search-title">
          <p className="page-title">MARVEL CHARACTERS</p>
          <div className="">
            <FontAwesomeIcon className="loop" icon="magnifying-glass" />
            <input
              className="search-bar"
              type="text"
              placeholder="Search a character here..."
              onChange={handleSearchChange}
              value={search}
            />
          </div>
        </section>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <motion.div className="character-container">
            {data.results.map((character) => {
              const favourite =
                token && savedFav.find((fav) => fav.id === character._id);

              return (
                <motion.div
                  key={character._id}
                  layout
                  transition={{ layout: { duration: 1 }, type: "spring" }}
                  className="character-card"
                >
                  <motion.div className="chImg-btn" layout>
                    {token && favourite ? (
                      <motion.button
                        // className={favourite ? "star-btn-gold" : "star-btn"}
                        className="star-btn-gold"
                        layout="position"
                        onClick={async () => {
                          try {
                            // console.log(userId);
                            const response = await axios.put(
                              `http://localhost:4500/user/deletefav/${userId}`,

                              {
                                id: character._id,
                                name: character.name,
                                image: character.image,
                              }
                            );

                            setData(data);
                            console.log(response);
                            setSavedFav(response.data.favourites);
                          } catch (error) {
                            console.log(error.response);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon="star" />
                      </motion.button>
                    ) : (
                      <motion.button
                        // className={favourite ? "star-btn-gold" : "star-btn"}
                        className="star-btn"
                        layout="position"
                        onClick={async () => {
                          toast(`${character.name} added to favourites!`);
                          try {
                            const response = await axios.put(
                              `http://localhost:4500/user/update/${userId}`,

                              {
                                id: character._id,
                                name: character.name,
                                image:
                                  character.thumbnail.path +
                                  "." +
                                  character.thumbnail.extension,
                              }
                            );
                            // console.log(response);
                            setSavedFav(response.data.favourites);
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
                      </motion.button>
                    )}

                    {character.thumbnail.path ===
                    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ? (
                      <motion.div
                        layout="position"
                        className="character-picture"
                      >
                        <motion.img
                          layout="position"
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZfhR3FCR6J5wjX4ZGXRmq7tVH6crUjcw5D8dcekt_C4wPyjwZuiYiNmqVhAI9w0h6DO4&usqp=CAU"
                          alt="character placeholder"
                        ></motion.img>
                      </motion.div>
                    ) : (
                      <motion.div
                        layout="position"
                        className="character-picture"
                      >
                        <motion.img
                          layout="position"
                          src={
                            character.thumbnail.path +
                            "." +
                            character.thumbnail.extension
                          }
                          alt="character"
                        />
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div
                    layout="position"
                    onClick={() => {
                      setIsOpen(!isOpen);
                    }}
                  >
                    <LinesEllipsis
                      className="name"
                      text={character.name}
                      maxLine="1"
                      ellipsis="..."
                      trimRight
                      basedOn="letters"
                    ></LinesEllipsis>
                  </motion.div>

                  {isOpen && (
                    <motion.div>
                      {character.description ? (
                        <LinesEllipsis
                          className="description"
                          text={`${character.name} : ${character.description}`}
                          maxLine="8"
                          ellipsis="..."
                          trimRight
                          basedOn="letters"
                        ></LinesEllipsis>
                      ) : (
                        <motion.div>
                          <p className="description">
                            {character.name} : Lorem, ipsum dolor sit amet
                            consectetur adipisicing elit. Quos explicabo ullam
                            expedita error. Cum, distinctio et! Doloribus
                            similique repellat suscipit beatae, rem cumque
                            ducimus et nihil asperiores omnis non. Omnis.
                            Doloribus similique repellat suscipit beatae, rem
                            cumque ducimus et nihil asperiores.
                          </p>
                        </motion.div>
                      )}

                      <motion.div layout="position" className="character-btns">
                        {favourite ? (
                          <motion.button
                            style={{ color: "gold" }}
                            onClick={async () => {
                              try {
                                // console.log(userId);
                                const response = await axios.put(
                                  `http://localhost:4500/user/deletefav/${userId}`,

                                  {
                                    id: character._id,
                                    name: character.name,
                                    image: character.image,
                                  }
                                );

                                setData(data);
                                console.log(response);
                                setSavedFav(response.data.favourites);
                              } catch (error) {
                                console.log(error.response);
                              }
                            }}
                          >
                            <FontAwesomeIcon icon="star" />
                            <span> saved to favourites</span>
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={async () => {
                              toast(`${character.name} added to favourites!`);
                              try {
                                const response = await axios.put(
                                  `http://localhost:4500/user/update/${userId}`,

                                  {
                                    id: character._id,
                                    name: character.name,
                                    image:
                                      character.thumbnail.path +
                                      "." +
                                      character.thumbnail.extension,
                                  }
                                );
                                console.log(response);
                                setSavedFav(response.data.favourites);
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
                            <span> add to favourites</span>
                          </motion.button>
                        )}

                        {/* <Link to={`/character/${character._id}`}></Link> */}
                        <motion.button
                          onClick={() => {
                            navigate(`/character/${character._id}`);
                          }}
                        >
                          <FontAwesomeIcon icon="plus" />
                          <span> more info</span>
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
      {/* PAGINATION SECTION */}
      <section className="page">
        <div className="pagination-block">
          <ReactPaginate
            previousLabel={"prev"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={numberOfPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={1}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </div>
      </section>
      {/* FOOTER */}
      <footer className="footer-character"></footer>
      {/* NOTIFICATIONS COMPONENT FROM REACT TOASTIFY PACKAGE */}
      <ToastContainer
        className="toast"
        position="top-right"
        autoClose={2000}
        // hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </main>
  );
};
export default Characters;
