import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ProgressBar } from "react95";
import { useNavigate } from "react-router-dom";

const Loading = () => {
  const [percent, setPercent] = useState(0);
  const navigate = useNavigate();

  const originalStyles = useMemo(
    () => ({
      backgroundColor: document.body.style.backgroundColor,
      margin: document.body.style.margin,
      htmlHeight: document.documentElement.style.height,
    }),
    []
  );

  const restoreOriginalStyles = useCallback(() => {
    document.body.style.backgroundColor = originalStyles.backgroundColor;
    document.body.style.margin = originalStyles.margin;
    document.documentElement.style.height = originalStyles.htmlHeight;
  }, [originalStyles]);

  useEffect(() => {
    document.body.style.backgroundColor = "rgb(0, 128, 128)";
    document.body.style.margin = "0";
    document.documentElement.style.height = "100%";

    const timer = setInterval(() => {
      setPercent((prevPercent) => {
        if (prevPercent >= 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 20;
        return Math.min(prevPercent + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
      restoreOriginalStyles();
    };
  }, [restoreOriginalStyles]);

  useEffect(() => {
    if (percent === 100) {
      navigate("/", { replace: true });
    }
  }, [percent, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        padding: 0,
        boxSizing: "border-box",
        minHeight: "90vh",
        maxHeight: "90vh",
        paddingTop: "48px",
      }}
    >
      <img
        src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/insieme_logo.jpg"
        alt="rvrc_logo"
        style={{ marginBottom: "20px", width: "20%" }}
      />
      Loading ...
      <ProgressBar
        variant="tile"
        value={Math.floor(percent)}
        style={{ width: "50%", minWidth: "250px" }}
      />
    </div>
  );
};

export default Loading;
