import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  TextInput,
  Button,
  Anchor,
  Tooltip,
} from "react95";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { supabaseClient } from "../supabase/supabaseClient";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { LoadingHourglass } from "../components/loadinghourglass";
import { sessionContext } from "../context/context";

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
  justify-content: space-between;
  align-items: center;
`;

export const Login = () => {
  const [email, setemail] = useState("");
  const { session, setSession } = useContext(sessionContext);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const constraintsRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation
  const dragX = useMotionValue(0);
  const dragxError = useMotionValue(0);

  const rotateValue = useTransform(dragX, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!email || !password) {
        setIsModalOpen(true);
        setError({
          name: "Error",
          message: "Email and password are required.",
        });
        return;
      }

      // check if email is valid and password is at least 6 chars
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setIsModalOpen(true);
        setError({
          name: "Error",
          message: "Please enter a valid email address.",
        });
        return;
      }

      if (password.length < 6) {
        setIsModalOpen(true);
        setError({
          name: "Error",
          message: "Password must be at least 6 characters.",
        });
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          throw error;
        }
        setIsLoading(false);
        setSession(data);
        navigate("/", { replace: true });
      } catch (error) {
        setIsLoading(false);
        setIsModalOpen(true);
        setError(error);
      }
    },
    [email, password, navigate, setSession]
  );

  const windowStyle = useMemo(
    () => ({
      width: windowWidth > 500 ? 500 : "90%", // Adjust width here
      margin: "0%",
    }),
    [windowWidth]
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
        backgroundColor: "rgb(0, 128, 128)",
      }}
    >
      <Helmet>
        <title>Insieme 2024 - Login</title>
        <meta name="description" content="Insieme Login page" />
      </Helmet>
      <motion.div
        drag
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={modalVariants}
        dragConstraints={constraintsRef}
        style={{ rotate: rotateValue, x: dragX }} // Apply the dynamic rotation and x position
      >
        <Window style={windowStyle}>
          <WindowHeader>
            <span>Insieme 2024</span>
          </WindowHeader>
          <div style={{ marginTop: 8 }}>
            <Tooltip text="Meow! 🐱‍" enterDelay={100} leaveDelay={100}>
              <img
                src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/insieme_logo.jpg"
                alt="rvrc-logo"
                width={100}
                onClick={() => {
                  window.open("https://t.me/rvrcfop", "_blank");
                }}
              />
            </Tooltip>
          </div>
          <WindowContent>
            {isLoading ? (
              <LoadingHourglass />
            ) : (
              <form onSubmit={handleSubmit}>
                <div>
                  <p style={{ display: "flex", justifySelf: "left" }}>
                    Email address
                  </p>
                  <TextInput
                    style={{ flex: 1 }}
                    placeholder=""
                    value={email}
                    onChange={(e) => {
                      setemail(e.target.value);
                    }}
                  />
                  <br />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <p style={{ justifySelf: "left" }}>Password</p>
                    <Anchor href="/resetform">Forgot your password?</Anchor>
                  </div>
                  <TextInput
                    placeholder=""
                    style={{ flex: 1 }}
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <br />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <Button type="submit" value="login">
                      Sign in
                    </Button>
                    <div style={{ marginTop: "5px" }}>
                      New to Insieme?
                      <Anchor href="/signup"> Create an account</Anchor>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </WindowContent>
        </Window>
      </motion.div>
      {isModalOpen && (
        <div
          ref={constraintsRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex", // Use flexbox for centering
            alignItems: "center", // Vertical center
            justifyContent: "center", // Horizontal center
            zIndex: 10, // Ensure it's above other content
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
              left: "0%",
              width: "80%", // Responsive width
              maxWidth: "90%", // Ensures it doesn't get too large on big screens
              zIndex: 10,
            }}
          >
            <Window style={windowStyle}>
              <StyledWindowHeader>
                <span>{error.name} ⚠️</span>
                <Button onClick={() => setIsModalOpen(false)}>
                  <CloseIcon />
                </Button>
              </StyledWindowHeader>
              <WindowContent>{error.message}</WindowContent>
            </Window>
          </motion.div>
        </div>
      )}
    </div>
  );
};
