import { Window, WindowContent, WindowHeader } from "react95";
import Iframe from "react-iframe";

const Video = () => {
  return (
    <div
      style={{
        height: "100vh", // Ensure the container takes up the full height of the viewport
        width: "100vw", // Ensure the container takes up the full width of the viewport
        display: "flex",
        position: "relative",
      }}
    >
      <Window
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <WindowHeader>Video Player</WindowHeader>
        <WindowContent
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <Iframe
            width="100%"
            height="100%"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative"
            allowFullScreen
            url="https://www.youtube.com/embed/r3-G5OoLta0?si=al7aGhVUGH_S06-F&amp;controls=0"
            title="Bongo Cat"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          />
        </WindowContent>
      </Window>
    </div>
  );
};

export default Video;
