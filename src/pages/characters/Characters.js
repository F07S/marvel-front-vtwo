// COMPONENT IMPORTS
import Header from "../../components/header/Header";
import StarFavBtnCh from "../../components/charactersPageBtns/StarFavBtnCh";
import RegFavBtnCh from "../../components/charactersPageBtns/RegFavBtnCh";

// ACTIVITY INDICATOR LIBRARY IMPORT
import Bounce from "react-activity/dist/Bounce";
import "react-activity/dist/library.css";

// VECTOR ICON IMPORT
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// PAGINATION PACKAGE IMPORT
import ReactPaginate from "react-paginate";

// LINE ELLIPSIS PACKAGE IMPORT
import LinesEllipsis from "react-lines-ellipsis";

// ANIMATION PACKAGE IMPORT
import { motion } from "framer-motion";

// POP-UP NOTIFICATIONS PACKAGE IMPORT
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// AXIOS IMPORT
import axios from "axios";

// REACT ELEMENTS IMPORT
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//COOKIES PACKAGE IMPORT
import Cookies from "js-cookie";

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
          `https://site--marvel-backend--phfc9s47kbj5.code.run/characters?name=${search}&skip=${skip}`
          // `http://localhost:4500/characters?name=${search}&skip=${skip}`
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
        const response = await axios.get(
          `https://site--marvel-backend--phfc9s47kbj5.code.run/user`
          // `http://localhost:4500/user`
        );
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
        <Header></Header>
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
          <div className="activity">
            <Bounce className="activity-ind" />
          </div>
        ) : (
          <motion.div className="character-container">
            {data.results.map((character) => {
              // console.log(typeof savedFav);
              const favourite =
                token && [...savedFav].find((fav) => fav.id === character._id);

              return (
                <motion.div
                  key={character._id}
                  layout
                  transition={{ layout: { duration: 1 }, type: "spring" }}
                  className="character-card"
                >
                  <motion.div className="chImg-btn" layout>
                    <StarFavBtnCh
                      favourite={favourite}
                      setData={setData}
                      data={data}
                      setSavedFav={setSavedFav}
                      character={character}
                      userId={userId}
                    ></StarFavBtnCh>

                    {character.thumbnail.path ===
                    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ? (
                      <motion.div
                        layout="position"
                        className="character-picture"
                      >
                        <motion.img
                          layout="position"
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZfhR3FCR6J5wjX4ZGXRmq7tVH6crUjcw5D8dcekt_C4wPyjwZuiYiNmqVhAI9w0h6DO4&usqp=CAU"
                          alt="character"
                          onClick={() => {
                            setIsOpen(!isOpen);
                          }}
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
                          onClick={() => {
                            setIsOpen(!isOpen);
                          }}
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
                        <RegFavBtnCh
                          favourite={favourite}
                          setData={setData}
                          data={data}
                          setSavedFav={setSavedFav}
                          character={character}
                          userId={userId}
                        ></RegFavBtnCh>

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
