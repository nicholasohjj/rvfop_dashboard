import { useState, useRef, useEffect } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  TextInput,
  Button,
  Tooltip,
} from "react95";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { supabaseClient } from "../supabase/supabaseClient";
import styled from "styled-components";
import logo from '../assets/logo.png';

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

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  const handleResetPassword = async () => {
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: "https://insieme.vercel.app/reset",
      });

      if (error) {
        throw error;
      }

      setIsModalOpen(true);
      setError({
        name: "Password Reset Email Sent",
        message: `An email has been sent to ${email} with a link to reset your password.`,
      });
    } catch (error) {
      setIsModalOpen(true);
      setError(error);
    }
  };

  const handleSubmit = async (e) => {
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
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      console.log(data, error);

      if (error) {
        console.log("Error");
        throw error;
      }

      navigate("/", { replace: true });
    } catch (error) {
      setIsModalOpen(true);
      setError(error);
    }
  };

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
                src={logo}
                alt="rvrc-logo"
                width={100}
              />
            </Tooltip>
          </div>
          <WindowContent>
            <form onSubmit={handleSubmit}>
              <div>
                <div style={{ display: "flex" }}>
                  <TextInput
                    placeholder="Email Address"
                    fullWidth
                    value={email}
                    onChange={(e) => {
                      setemail(e.target.value);
                    }}
                  />
                </div>
                <br />
                <TextInput
                  placeholder="Password"
                  fullWidth
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <br />
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <Button onClick={() => handleResetPassword()}>
                    Forgot your password?
                  </Button>
                  <Button onClick={() => navigate("/signup")}>
                    Sign up
                  </Button>
                  <Button type="submit" value="login">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
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
