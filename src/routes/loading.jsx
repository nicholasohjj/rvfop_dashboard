import { useState, useEffect } from "react";
import { ProgressBar } from "react95";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png'
const Loading = () => {
  const [percent, setPercent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const originalBackgroundColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "rgb(0, 128, 128)";
    document.body.style.margin = "0"; // Remove default margin
    document.documentElement.style.height = "100%"; // Ensure html element covers full height

    const timer = setInterval(() => {
      setPercent((previousPercent) => {
        if (previousPercent >= 100) {
          clearInterval(timer); // Clear interval immediately to prevent unnecessary updates
          return 100;
        }
        const diff = Math.random() * 20;
        return Math.min(previousPercent + diff, 100);
      });
    }, 500);

    return () => {
      document.body.style.backgroundColor = originalBackgroundColor;
      document.body.style.margin = "";
      document.documentElement.style.height = "";
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (percent === 100) {
      navigate("/"); // Replace '/next-route' with your actual route
    }
  }, [percent, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw", // Ensure it covers full width
        height: "100vh", // Ensure it covers full height
        padding: 0, // Remove any default padding
        boxSizing: "border-box", // Ensure padding and border are included in total width and height
        minHeight: "90vh",
        maxHeight: "90vh",
        paddingTop: "48px",
      }}
    >
      <img
        src={logo}
        alt="RVRC Logo"
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
