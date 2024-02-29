import { useState, useRef, useEffect } from "react";

import {
  Window,
  WindowHeader,
  WindowContent,
  TextInput,
  Button,
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
    content: '';
    position: absolute;
    background: ${({ theme }) => theme.materialText}; // Adjust the color as needed
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
  background-color: #FF0000; // Change this hex code to your desired color
  color: white; // Adjust the text color as needed for contrast
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Reset = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const constraintsRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const getEmail = async () => {
      const { data } = await supabaseClient.auth.getUser();
      setemail(data.user.email);
  };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    getEmail();
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleReturnHome = () => {
    setPassword("");
    navigate("/");
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      supabaseClient.auth.getSession().then(({ data: { session } }) => {
      })

      navigate("/");
    }
    catch (error) {
      setIsModalOpen(true);
      setError(error);
    }
  };

  const windowStyle = {
    width: windowWidth > 500 ? 500 : '90%', // Adjust width here
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
      <motion.div drag dragConstraints={constraintsRef} >
      <Window style={windowStyle}>
          <WindowHeader>
            <span>Reset your password</span>
          </WindowHeader>
          <WindowContent>
          <form onSubmit={handleSubmit}>

              <div >
                <div style={{ display: "flex" }}>
                  <TextInput
                    placeholder="Email Address"
                    fullWidth
                    value={email}
                    disabled 
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

                <Button type="submit" value="login">
                  Update
                  </Button>


              </div>
            </form>
          </WindowContent>
        </Window>
      </motion.div>
      {isModalOpen && (
        <div
        ref={constraintsRef}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed", // Use fixed to position relative to the viewport
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
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
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%', // Responsive width
            maxWidth: '90%', // Ensures it doesn't get too large on big screens
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
            <WindowContent>
              {error.message}
            </WindowContent>
          </Window>
        </motion.div>
        </div>

          
      )}
    </div>
  );
};
