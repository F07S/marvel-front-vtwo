import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Cookies from "js-cookie";
import AnimatedText from "react-animated-text-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
const Comic = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const id = params.id;
  //   console.log(id);

  // USER USESTATES
  const [userId, setUserId] = useState();
  const token = Cookies.get("token");
  // console.log(token);
  // FAVOURITES USESTATE
  const [savedFav, setSavedFav] = useState(false);

  // NAVIGATE
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/comic/${id}`);
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
        const favourite = foundUser.comics.find((com) => com.id === id);
        if (favourite) {
          setSavedFav(true);
        }
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchUser();
    fetchComic();
  }, [id, token]);

  // IMAGE ERROR MANAGEMENT
  const imgPlaceholder =
    "https://t4.ftcdn.net/jpg/02/21/50/43/360_F_221504390_fjHkRmmJp0cRtiff6L0L5Gl8kZQIBzWh.jpg";

  const onImgError = (event) => {
    event.target.src = imgPlaceholder;
  };

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <main className="one-comic-main">
      <section className="one-comic-page">
        <Header></Header>
        {/* COMIC TITLE CONTAINER */}
        <section className="one-comic-title">
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
            className="one-comic-name"
            includeWhiteSpaces
            threshold={0.1}
            rootMargin="20%"
          >
            {data.title}
          </AnimatedText>
        </section>
        <section className="one-comic-container">
          {data.thumbnail.path ===
          "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ? (
            <img
              className="com-img"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZfhR3FCR6J5wjX4ZGXRmq7tVH6crUjcw5D8dcekt_C4wPyjwZuiYiNmqVhAI9w0h6DO4&usqp=CAU"
            ></img>
          ) : (
            <img
              className="one-com-img"
              src={data.thumbnail.path + "." + data.thumbnail.extension}
              alt="character"
              onError={onImgError}
            />
          )}
          <div className="one-com-desc-button">
            <AnimatedText
              type="words"
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
              className="one-comic-desc"
              includeWhiteSpaces
              threshold={0.1}
              rootMargin="20%"
            >
              {data.description
                ? `${data.description}`
                : `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos explicabo ullam expedita error. Cum, distinctio et! Doloribus similique repellat suscipit beatae, rem cumque ducimus et nihil asperiores omnis non. Omnis. Doloribus similique repellat suscipit beatae, rem cumque ducimus et nihil asperiores.`}
            </AnimatedText>
            {savedFav ? (
              <button
                className="fav-btn-com"
                style={{ color: "gold" }}
                onClick={async () => {
                  try {
                    // console.log(userId);
                    const response = await axios.put(
                      `http://localhost:4500/user/deletecomic/${userId}`,

                      {
                        id: data._id,
                        name: data.title,
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
                className="fav-btn-com"
                onClick={async () => {
                  try {
                    const response = await axios.put(
                      `http://localhost:4500/user/addcomic/${userId}`,

                      {
                        id: data._id,
                        name: data.title,
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
        </section>
      </section>
      {/* FOOTER */}
      <footer className="footer-one-com"></footer>
    </main>
  );
};

export default Comic;
