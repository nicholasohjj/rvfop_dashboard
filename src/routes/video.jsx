import { Window, WindowContent, WindowHeader } from "react95";
import Iframe from "react-iframe";
import React, { useEffect } from 'react';

const videos = [
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/GAYLE_-_abcdefu__cover_by_Bongo_Cat____.mp4",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/Rick%20Astley%20-%20Never%20Gonna%20Give%20You%20Up%20(Official%20Music%20Video).mp4",
]

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
