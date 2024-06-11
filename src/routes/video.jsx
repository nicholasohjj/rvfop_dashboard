import { Window, WindowContent, WindowHeader } from "react95";
import Iframe from "react-iframe";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

const videos = [
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/GAYLE_-_abcdefu__cover_by_Bongo_Cat____.mp4",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/Bongo_Cat_-_BLACKPINK__DDU-DU_DDU-DU___K-POP_.mp4?t=2024-06-11T15%3A21%3A42.696Z",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/_bongo_cat_and_friends__meow.mp4?t=2024-06-11T15%3A23%3A25.461Z",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/videoplayback.mp4?t=2024-06-11T15%3A29%3A05.571Z"
];

const Video = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        position: "relative",
      }}
    >
      <Helmet>
        <title>Insieme 2024 - ????</title>
        <meta name="description" content="????" />
      </Helmet>
      <Window
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <WindowHeader>????</WindowHeader>
        <WindowContent
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <Iframe
            url={videos[Math.floor(Math.random() * videos.length)]}
            width="100%"
            height="100%"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative"
            allowFullScreen
            title="Bongo Cat"
            frameBorder="0"
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </WindowContent>
      </Window>
    </div>
  );
};

export default Video;
