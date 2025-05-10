import { useState } from "react";
import "./Videoslider.scss";

function Videoslider({ videos }) {
  const [videoIndex, setVideoIndex] = useState(null);

  const changeSlide = (direction) => {
    if (direction === "left") {
      if (videoIndex === 0) {
        setVideoIndex(videos.length - 1);
      } else {
        setVideoIndex(videoIndex - 1);
      }
    } else {
      if (videoIndex === videos.length - 1) {
        setVideoIndex(0);
      } else {
        setVideoIndex(videoIndex + 1);
      }
    }
  };

  return (
    <div className="slider_video">
      {videoIndex !== null && (
        <div className="fullSlider_video">
          <div className="arrow" onClick={() => changeSlide("left")}>
            <img controls autoPlay loop src="/arrow.png" alt="" />
          </div>
          <div className="videoContainer">
            <video controls autoPlay loop src={videos[videoIndex]} alt="" />
          </div>
          <div className="arrow" onClick={() => changeSlide("right")}>
            <img src="/arrow.png" className="right" alt="" />
          </div>
          <div className="close" onClick={() => setVideoIndex(null)}>
            X
          </div>
        </div>
      )}
      <div className="bigvideo">
        <video controls autoPlay loop src={videos[0]} alt="" onClick={() => setVideoIndex(0)} />
      </div>
      <div className="smallvideo">
        {videos.slice(1).map((video, index) => (
          <video
          controls 
          autoPlay 
          loop
            src={video}
            alt=""
            key={index}
            onClick={() => setVideoIndex(index + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default Videoslider;
