import { useState, useRef, useEffect, useContext } from "react";

import {
  Window,
  WindowHeader,
  WindowContent,
  TextInput,
  Button,
  Anchor,
} from "react95";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { supabaseClient } from "../../supabase/supabaseClient";
import styled from "styled-components";
import { fetchUser } from "../../supabase/services";
import { userContext } from "../../context/context";
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

export const Update = () => {
  const { user, setUser } = useContext(userContext); // Get the user context
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const dragX = useMotionValue(0);
  const dragxError = useMotionValue(0);

  const rotateValue = useTransform(dragX, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees

  const constraintsRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const init = async () => {
      if (!user) {
        const user = await fetchUser();
        setUser(user);
        setemail(user.email);
      } else {
        setemail(user.email);
      }
    };
    init();
  }, [user, setUser]);

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError({
        name: "Password Mismatch",
        message: "Passwords do not match.",
      });
      setIsModalOpen(true);
      return;
    }


    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      supabaseClient.auth.getSession().then(({ data: { session } }) => {});
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
        dragConstraints={constraintsRef}
        style={{ rotate: rotateValue, x: dragX }} // Apply the dynamic rotation and x position
      >
        <Window style={windowStyle}>
          <WindowHeader>
            <span>Update your password</span>
          </WindowHeader>
          <WindowContent>
            <p style={{ display: "flex" }}>
              Enter your new password below. Make sure it is at least 6
              characters.
            </p>
            <form onSubmit={handleSubmit}>
              <div>
                <p style={{ display: "flex" }}>Email address</p>
                <TextInput
                  placeholder=""
                  style={{ flex: 1 }}
                  value={email}
                  disabled
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                />
              </div>
              <br />
              <p style={{ display: "flex" }}>New Password</p>
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ display: "flex" }}>Confirm your new password</p>
                {!passwordsMatch && (
                  <p style={{ color: "red" }}>Passwords do not match.</p>
                )}
              </div>
              <TextInput
                placeholder=""
                style={{ flex: 1 }}
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
              <br />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button type="submit" value="login">
                  Update
                </Button>
                <Anchor href="/">Return home</Anchor>
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
