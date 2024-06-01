import { useState, useRef, useEffect } from "react";
import {
  Window,
  Hourglass,
  WindowHeader,
  WindowContent,
  Avatar,
  Button,
} from "react95";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchUser } from "../../supabase/services";
import { ProfileAvatar } from "../../components/profileavatar";
const StyledWindowHeader = styled(WindowHeader)`
  background-color: #ff0000;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Profile = () => {
  const [user, setUser] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const dragX = useMotionValue(0);
  const dragxError = useMotionValue(0);

  const rotateValue = useTransform(dragX, [-100, 100], [-10, 10]);
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]);

  const constraintsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    Promise.all([fetchUser()]).then(([user]) => {
      setUser(user);
    });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleReturnHome = () => {
    navigate("/");
  };

  const windowStyle = {
    width: windowWidth > 500 ? 500 : "90%",
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
        dragConstraints={constraintsRef}
        style={{ rotate: rotateValue, x: dragX }}
      >
        <Window style={windowStyle}>
          <StyledWindowHeader>
            <span>My Profile</span>
          </StyledWindowHeader>
          <WindowContent>
            {!user && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Loading...
                <Hourglass size={32} style={{ margin: 20 }} />
              </div>
            )}
            {user && (
              <div
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "10px",
                  alignItems: "center",
                  justifyItems: "center",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <ProfileAvatar name={user.profile_name} nameColor={user.id} />
                  <div>
                    <strong>{user.profile_name}</strong>
                  </div>
                </div>
                <div>Email: {user.email}</div>
                <div>Role: {user.role_name}</div>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Button onClick={() => navigate("/update")}>
                Update Password
              </Button>
              <Button onClick={() => handleReturnHome()}>Return home</Button>
            </div>
          </WindowContent>
        </Window>
      </motion.div>
    </div>
  );
};
