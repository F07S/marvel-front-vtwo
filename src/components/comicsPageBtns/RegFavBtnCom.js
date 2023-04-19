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
const RegFavBtnCom = ({
  favourite,
  setData,
  data,
  setSavedFav,
  comic,
  userId,
}) => {
  // NAVIGATE
  const navigate = useNavigate();
  return (
    <>
      {favourite ? (
        <motion.button
          style={{ color: "gold" }}
          onClick={async () => {
            try {
              // console.log(userId);
              const response = await axios.put(
                `https://site--marvel-backend--phfc9s47kbj5.code.run/user/deletecomic/${userId}`,
                // `http://localhost:4500/user/deletecomic/${userId}`,

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
                `https://site--marvel-backend--phfc9s47kbj5.code.run/user/addcomic/${userId}`,
                // `http://localhost:4500/user/addcomic/${userId}`,

                {
                  id: comic._id,
                  name: comic.title,
                  image: comic.thumbnail.path + "." + comic.thumbnail.extension,
                }
              );
              // console.log(response);
              setSavedFav(response.data.comics);
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
        </motion.button>
      )}
    </>
  );
};
export default RegFavBtnCom;
