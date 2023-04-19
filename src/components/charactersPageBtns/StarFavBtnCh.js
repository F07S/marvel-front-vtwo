// POP-UP NOTIFICATIONS PACKAGE IMPORT
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ANIMATION PACKAGE IMPORT
import { motion } from "framer-motion";

// AXIOS IMPORT
import axios from "axios";
import { useNavigate } from "react-router-dom";

// VECTOR ICON IMPORT
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StarFavBtnCh = ({
  token,
  favourite,
  setData,
  data,
  setSavedFav,
  character,
  userId,
}) => {
  // NAVIGATE
  const navigate = useNavigate();
  return (
    <>
      {token && favourite ? (
        <motion.button
          // className={favourite ? "star-btn-gold" : "star-btn"}
          className="star-btn-gold"
          layout="position"
          onClick={async () => {
            try {
              // console.log(userId);
              const response = await axios.put(
                `https://site--marvel-backend--phfc9s47kbj5.code.run/user/deletefav/${userId}`,
                // `http://localhost:4500/user/deletefav/${userId}`,

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
          className="star-btn"
          layout="position"
          onClick={async () => {
            toast(`${character.name} added to favourites!`);
            try {
              const response = await axios.put(
                `https://site--marvel-backend--phfc9s47kbj5.code.run/user/update/${userId}`,
                // `http://localhost:4500/user/update/${userId}`,

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
              if ((error.response.data.message = "Missing parameters")) {
                navigate("/login");
              }
            }
          }}
        >
          <FontAwesomeIcon icon="star" />
        </motion.button>
      )}
    </>
  );
};
export default StarFavBtnCh;
