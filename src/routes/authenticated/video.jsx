import { Window, WindowContent, WindowHeader } from "react95";
import Iframe from "react-iframe";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet";
import { LoadingHourglass } from "../../components/loadinghourglass";
const videos = [
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/GAYLE_-_abcdefu__cover_by_Bongo_Cat____.mp4",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/Bongo_Cat_-_BLACKPINK__DDU-DU_DDU-DU___K-POP_.mp4?t=2024-06-11T15%3A21%3A42.696Z",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/_bongo_cat_and_friends__meow.mp4?t=2024-06-11T15%3A23%3A25.461Z",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/videoplayback.mp4?t=2024-06-11T15%3A29%3A05.571Z",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/Y2meta.app___Let_It_Go_(cover_by_Bongo_Cat)____(720p).mp4?t=2024-07-03T07%3A21%3A31.274Z",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/Y2meta.app_BTS_(_____)__Dynamite____(cover_by_Bongo_Cat)_____(480p).mp4?t=2024-07-03T07%3A23%3A50.359Z",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/Y2meta.app___Imagine_Cats___Believer____(720p).mp4?t=2024-07-03T07%3A24%3A44.082Z",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/Y2meta.app___Ed_Sheeran___Shape_of_You_(cover_by_Bongo_Cat)____(1080p).mp4?t=2024-07-03T07%3A25%3A38.843Z"
];

const Video = () => {
  const [isLoading, setIsLoading] = useState(true);
  const videoUrl = useMemo(() => {
    return videos[Math.floor(Math.random() * videos.length)];
  }, []);

  // Memoize handleLoad callback
  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const iframe = document.getElementById("myId");
    iframe.addEventListener("load", handleLoad);
    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, [handleLoad]);

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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isLoading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white", // Optional: Add a background color to cover the content beneath
                zIndex: 1,
              }}
            >
              <LoadingHourglass />
            </div>
          )}
          <Iframe
            url={`${videoUrl}#t=0.5&controls=0&autoplay=1&disablekb=1`}
            width="100%"
            height="100%"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative"
            allowFullScreen
            title="Bongo Cat"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ display: isLoading ? "none" : "block" }}
          />
        </WindowContent>
      </Window>
    </div>
  );
};

export default Video;
