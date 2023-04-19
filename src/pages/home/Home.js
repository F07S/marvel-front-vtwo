import AnimatedText from "react-animated-text-content";
import { useNavigate } from "react-router-dom";
import videoBg from "../../assets/video/marvel-low.mp4";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [videoStarted, setVideoStarted] = useState(false);

  const videoFadeOut = () => {
    setTimeout(() => {
      setVideoStarted(false);
    }, 9300);
  };

  return (
    <main className="home-main">
      <video
        className="video"
        src={videoBg}
        autoPlay
        muted
        style={{
          opacity: videoStarted ? 1 : 0,
          transition: "opacity, 3s ease-in-out",
        }}
        onPlaying={() => {
          setVideoStarted(true);
          videoFadeOut();
          setTimeout(() => {
            navigate("/characters");
          }, 12400);
        }}
      ></video>

      <section className="home-animation">
        {videoStarted && (
          <AnimatedText
            className="marvel"
            type="words"
            interval={0.01}
            duration={7.5}
            animation={{
              y: "100px",
              ease: "ease-in",
              scale: 8.19,
            }}
          >
            MARVEL
          </AnimatedText>
        )}
      </section>
    </main>
  );
};

export default Home;
