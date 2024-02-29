import { useState, useRef, useEffect } from "react";

import {
  Window,
  WindowHeader,
  WindowContent,
  TextInput,
  Button,
  Tooltip,
} from "react95";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { supabaseClient } from "../supabase/supabaseClient";
import styled from "styled-components";

// Styled Close Icon Component
const CloseIcon = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  cursor: pointer;
  transform: rotateZ(45deg);
  position: relative;
  &:before,
  &:after {
    content: "";
    position: absolute;
    background: ${({ theme }) =>
      theme.materialText}; // Adjust the color as needed
  }
  &:before {
    height: 100%;
    width: 3px;
    left: 50%;
    transform: translateX(-50%);
  }
  &:after {
    height: 3px;
    width: 100%;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const StyledWindowHeader = styled(WindowHeader)`
  background-color: #ff0000; // Change this hex code to your desired color
  color: white; // Adjust the text color as needed for contrast
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorPage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const constraintsRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const windowStyle = {
    width: windowWidth > 500 ? 500 : "90%", // Adjust width here
    margin: "0%",
  };

  return (
    <div
      ref={constraintsRef}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "rgb(0, 128, 128)",
      }}
    >
      <motion.div drag dragConstraints={constraintsRef}>
        <Window style={windowStyle}>
          <StyledWindowHeader>
            <span>Error 404</span>
          </StyledWindowHeader>
          <WindowContent>
            <p>The page you are looking for does not exist.</p>
            <Button style={{ margin: 10 }} onClick={() => navigate("/")}>
              Return home
            </Button>
          </WindowContent>
        </Window>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
