{
  /* <motion.button
                      className={favourite ? "star-btn-gold" : "star-btn"}
                      // className="star-btn"
                      layout="position"
                      onClick={async () => {
                        toast(`${character.name} added to favourites!`);
                        try {
                          // console.log(userId);
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
                          // console.log(response.data.favourites);
                          setSavedFav(response.data.favourites);
                        } catch (error) {
                          console.log(error.message);
                          if (
                            (error.response.data.message = "Missing parameters")
                          ) {
                            navigate("/login");
                          }
                        }
                      }}
                    >
                      <FontAwesomeIcon icon="star" />
                    </motion.button> */
}

// {character.description ? (
//   <LinesEllipsis
//     className="description"
//     text={`${character.name} : ${character.description}`}
//     maxLine="8"
//     ellipsis="..."
//     trimRight
//     basedOn="letters"
//   ></LinesEllipsis>
// ) : (
//   <motion.div>
//     <p className="description">
//       {character.name} : Lorem, ipsum dolor sit amet
//       consectetur adipisicing elit. Quos explicabo ullam
//       expedita error. Cum, distinctio et! Doloribus
//       similique repellat suscipit beatae, rem cumque
//       ducimus et nihil asperiores omnis non. Omnis.
//       Doloribus similique repellat suscipit beatae, rem
//       cumque ducimus et nihil asperiores.
//     </p>
//   </motion.div>
// )}

// <motion.div>
{
  /* <LinesEllipsis
  className="description"
  text={
    character.description
      ? `${character.name} : ${character.description}`
      : `${character.name} : Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos explicabo ullam expedita error. Cum, distinctio et! Doloribus similique repellat suscipit beatae, rem cumque ducimus et nihil asperiores omnis non. Omnis. Doloribus similique repellat suscipit beatae, rem cumque ducimus et nihil asperiores.`
  }
  maxLine="8"
  ellipsis="..."
  trimRight
  basedOn="letters"
></LinesEllipsis> */
}
// </motion.div>
