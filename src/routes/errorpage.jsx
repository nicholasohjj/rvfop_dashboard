import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Window, WindowHeader, WindowContent, Button, Tooltip } from "react95";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useNavigate, useRouteError } from "react-router-dom"; // Import useNavigate
import styled from "styled-components";

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
  const dragxError = useMotionValue(0);

  const error = useRouteError(); // Hook to get the error object

  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const windowStyle = useMemo(
    () => ({
      width: windowWidth > 500 ? 500 : "90%",
      margin: "0%",
    }),
    [windowWidth]
  );

  const modalVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        scale: 0,
      },
      visible: {
        opacity: 1,
        scale: 1,
      },
    }),
    []
  );

  return (
    <div
      ref={constraintsRef}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, rgb(131, 220, 208), rgb(71, 161, 151))", // Use background instead of backgroundColor for gradients
      }}
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={modalVariants}
        style={{
          rotate: rotateValueError,
          x: dragxError,
          position: "absolute",
          top: "50%",
          bottom: "50%",
          width: "80%", // Responsive width
          maxWidth: "90%", // Ensures it doesn't get too large on big screens
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Window style={windowStyle}>
          <StyledWindowHeader>
            <span>Error</span>
          </StyledWindowHeader>
          <div style={{ marginTop: 8 }}>
            <Tooltip text="Woof! 🐶" enterDelay={100} leaveDelay={100}>
              <img
                src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/error.png"
                alt="error-logo"
                width={100}
              />
            </Tooltip>
          </div>
          <WindowContent>
            <div>
              <p>Oops! Something bad happened 😔</p>
              <i>
                Error {error.status}: {error.statusText || error.message}
              </i>
            </div>

            <Button
              style={{ margin: 10 }}
              onClick={() =>
                navigate("/", {
                  replace: true,
                })
              }
            >
              Return home
            </Button>
          </WindowContent>
        </Window>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
