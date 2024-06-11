import { useState, useRef, useEffect, useContext } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
} from "react95";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchUser } from "../../supabase/services";
import { userContext } from "../../context/userContext";
import { ProfileAvatar } from "../../components/profileavatar";
import { Helmet } from "react-helmet";
import { LoadingHourglass } from "../../components/loadinghourglass";
const StyledWindowHeader = styled(WindowHeader)`
  background-color: #ff0000;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Profile = () => {
  const { user, setUser } = useContext(userContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dragX = useMotionValue(0);

  const rotateValue = useTransform(dragX, [-100, 100], [-10, 10]);

  const constraintsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (!user) {
        const user = await fetchUser();
        setUser(user);
      }
    };
    init();
  }, [user, setUser]);

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
      <Helmet>
        <title>Insieme 2024 - Profile</title>
        <meta name="description" content="Check your user profile here" />
      </Helmet>
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
              <LoadingHourglass/>
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
