// import AnimatedText from "react-animated-text-content";
// import gsap from "gsap";
// import { useNavigate } from "react-router-dom";
// import videoBg from "../../assets/video/marvel.mp4";
// import { useState } from "react";

// const Home = () => {
//   const navigate = useNavigate();
//   const [videoStarted, setVideoStarted] = useState(true);

//   const fadeOut = () => {
//     setTimeout(() => {
//       setVideoStarted(false);
//     }, 10500);
//   };

//   return (
//     <main>
//       <video
//         className="video"
//         src={videoBg}
//         autoPlay
//         muted
//         style={{
//           opacity: videoStarted ? 1 : 0,
//           transition: "opacity, 3s ease-in-out",
//         }}
//         onPlaying={() => {
//           fadeOut();
//           setTimeout(() => {
//             navigate("/characters");
//           }, 13500);
//         }}
//       ></video>

//       <section>
//         <div className="lineTop"></div>
//         {!videoStarted ||
//           (videoStarted && (
//             <AnimatedText
//               onPlay={() => {
//                 gsap.to(".line", {
//                   x: 1500,
//                   duration: 2,
//                   backgroundColor: "white",
//                 });
//                 gsap.to(".lineTop", {
//                   x: -1500,
//                   duration: 2,
//                   backgroundColor: "white",
//                 });
//                 gsap.to(".marvel", { duration: 1, color: " rgb(23, 2, 43)" });
//                 setTimeout(() => {
//                   navigate("/characters");
//                 }, 1500);
//               }}
//               className="marvel"
//               type="words"
//               interval={0.06}
//               duration={9}
//               animation={{
//                 y: "100px",
//                 ease: "ease-in",
//                 scale: 8.19,
//               }}
//             >
//               MARVEL
//             </AnimatedText>
//           ))}

//         <div className="line"></div>
//       </section>
//     </main>
//   );
// };

// export default Home;
