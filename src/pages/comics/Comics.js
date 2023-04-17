import Header from "../../components/header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import LinesEllipsis from "react-lines-ellipsis";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// POP-UP NOTIFICATIONS PACKAGE
//################################################################################################
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Comics = () => {
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
  // console.log(token);

  // FAVOURITES USESTATE
  const [savedFav, setSavedFav] = useState(false);

  // NAVIGATE
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4500/comics?title=${search}&skip=${skip}`
        );
        // console.log(response.data.count);
        setCount(response.data.count);
        // console.log(response.data);
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
        setSavedFav(foundUser.comics);
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchUser();
    fetchData();
  }, [search, skip, token]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setSkip(0);
  };

  // PAGINATION MANAGEMENT
  const numberOfPages = Math.ceil(count / 100);
  // console.log(numberOfPages);

  const handlePageClick = (event) => {
    // console.log(event.selected * 100);
    setSkip(event.selected * 100);
  };

  // IMAGE ERROR MANAGEMENT
  const imgPlaceholder =
    "https://t4.ftcdn.net/jpg/02/21/50/43/360_F_221504390_fjHkRmmJp0cRtiff6L0L5Gl8kZQIBzWh.jpg";

  const onImgError = (event) => {
    event.target.src = imgPlaceholder;
  };

  return (
    <main className="comics-main">
      <section className="comics-page">
        <Header></Header>
        {/* MAIN IMAGE CONTAINER */}
        {/* TITLE SEARCH CONTAINER */}
        <section className="search-title-comics">
          <p className="page-title-comics">MARVEL COMICS</p>
          <div className="">
            <FontAwesomeIcon className="loop" icon="magnifying-glass" />
            <input
              className="search-bar-comics"
              type="text"
              placeholder="Search a comic here..."
              onChange={handleSearchChange}
              value={search}
            />
          </div>
        </section>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <motion.div className="comics-container">
            {data.results.map((comic) => {
              const favourite =
                token && savedFav.find((fav) => fav.id === comic._id);
              return (
                <motion.div
                  key={comic._id}
                  layout
                  transition={{ layout: { duration: 1 }, type: "spring" }}
                  className="comics-card"
                >
                  <motion.div className="comImg-btn">
                    {token && favourite ? (
                      <motion.button
                        // className={favourite ? "star-btn-gold" : "star-btn"}
                        className="star-btn-com-gold"
                        layout="position"
                        onClick={async () => {
                          try {
                            // console.log(userId);
                            const response = await axios.put(
                              `http://localhost:4500/user/deletecomic/${userId}`,

                              {
                                id: comic._id,
                                name: comic.title,
                                image: comic.image,
                              }
                            );

                            setData(data);
                            console.log(response);
                            setSavedFav(response.data.comics);
                          } catch (error) {
                            console.log(error.response);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon="star" />
                      </motion.button>
                    ) : (
                      <motion.button
                        className="star-btn-com"
                        layout="position"
                        onClick={async () => {
                          toast(`${comic.title} added to favourites!`);
                          try {
                            const response = await axios.put(
                              `http://localhost:4500/user/addcomic/${userId}`,

                              {
                                id: comic._id,
                                name: comic.title,
                                image:
                                  comic.thumbnail.path +
                                  "." +
                                  comic.thumbnail.extension,
                              }
                            );
                            // console.log(response);
                            setSavedFav(response.data.comics);
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

                    {comic.thumbnail.path ===
                    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ? (
                      <motion.div
                        layout="position"
                        className="character-picture"
                      >
                        <motion.img
                          layout="position"
                          src={imgPlaceholder}
                          alt="comic placeholder"
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
                            comic.thumbnail.path +
                            "." +
                            comic.thumbnail.extension
                          }
                          onError={onImgError}
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
                      className="name-com"
                      text={comic.title}
                      maxLine="1"
                      ellipsis="..."
                      trimRight
                      basedOn="letters"
                    ></LinesEllipsis>
                  </motion.div>

                  {isOpen && (
                    <motion.div>
                      {comic.description ? (
                        <LinesEllipsis
                          className="description-com"
                          text={`${comic.title} : ${comic.description}`}
                          maxLine="8"
                          ellipsis="..."
                          trimRight
                          basedOn="letters"
                        ></LinesEllipsis>
                      ) : (
                        // <p className="description">{character.description}</p>
                        <p className="description-com">
                          {comic.title} : Lorem, ipsum dolor sit amet
                          consectetur adipisicing elit. Quos explicabo ullam
                          expedita error. Cum, distinctio et! Doloribus
                          similique repellat suscipit beatae, rem cumque ducimus
                          et nihil asperiores omnis non. Omnis. Doloribus
                          similique repellat suscipit beatae, rem cumque ducimus
                          et nihil asperiores.
                        </p>
                      )}
                      <motion.div layout="position" className="character-btns">
                        {favourite ? (
                          <motion.button
                            style={{ color: "gold" }}
                            onClick={async () => {
                              try {
                                // console.log(userId);
                                const response = await axios.put(
                                  `http://localhost:4500/user/deletecomic/${userId}`,

                                  {
                                    id: comic._id,
                                    name: comic.title,
                                    image: comic.image,
                                  }
                                );

                                setData(data);
                                console.log(response);
                                setSavedFav(response.data.comics);
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
                              toast(`${comic.title} added to favourites!`);
                              try {
                                const response = await axios.put(
                                  `http://localhost:4500/user/addcomic/${userId}`,

                                  {
                                    id: comic._id,
                                    name: comic.title,
                                    image:
                                      comic.thumbnail.path +
                                      "." +
                                      comic.thumbnail.extension,
                                  }
                                );
                                // console.log(response);
                                setSavedFav(response.data.comics);
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
                            navigate(`/comic/${comic._id}`);
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
      <section className="page-comics">
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
      <footer className="footer-character"></footer>
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
export default Comics;
