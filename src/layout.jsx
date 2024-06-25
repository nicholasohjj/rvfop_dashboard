import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useContext, useCallback, useRef } from "react";
import { fetchUser } from "./supabase/services";
import styled from "styled-components";
import "./style.css"; // Make sure this points to your CSS file
import { userContext } from "./context/context";
import { WindowContent, WindowHeader, Window, Button } from "react95";
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

const Container = styled.div`
  flex: 1;
  max-width: 100vw;
  max-height: 100vh;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 100%;
`;

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

const ContentArea = styled.div`
  display: flex;
  min-height: 90vh;
  max-height: 90vh;
  padding-top: 48px;
  background-color: rgb(0, 128, 128);
`;

const windowStyle = {
  width: "90%", // Adjust width here
  margin: "0%",
};

const StyledWindowHeader = styled(WindowHeader)`
  color: white; // Adjust the text color as needed for contrast
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LargeButton = styled(Button)`
  width: 100px;
  height: 100px;
  margin: 20px;
  font-size: 24px;
`;

export const Layout = () => {
  const constraintsRef = useRef(null);

  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];

  const { user, setUser } = useContext(userContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputSequence, setInputSequence] = useState([]);
  const [isRotating, setIsRotating] = useState(false);
  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  };

  const handleTouchMove = (event) => {
    if (!touchStartX || !touchStartY) return;

    let touchEndX = event.changedTouches[0].clientX;
    let touchEndY = event.changedTouches[0].clientY;

    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (diffX > 0) {
        updateInputSequence("ArrowRight");
      } else {
        updateInputSequence("ArrowLeft");
      }
    } else {
      // Vertical swipe
      if (diffY > 0) {
        updateInputSequence("ArrowDown");
      } else {
        updateInputSequence("ArrowUp");
      }
    }

    touchStartX = 0;
    touchStartY = 0;
  };

  const handleTouchEnd = () => {
    touchStartX = 0;
    touchStartY = 0;
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const updateInputSequence = (input) => {
    setInputSequence((prevSequence) => {
      const newSequence = [...prevSequence, input].slice(-konamiCode.length);
      if (
        newSequence.slice(2).join(" ") === konamiCode.slice(0, -2).join(" ")
      ) {
        setIsModalOpen(true);
        console.log("Modal opened");
      }
      if (newSequence.join(" ") === konamiCode.join(" ")) {
        handleCloseModal();
        setIsRotating(true);
        setTimeout(() => setIsRotating(false), 2000); // Reset after 2 seconds
      }
      return newSequence;
    });
  };

  const handleButtonPress = (button) => {
    updateInputSequence(button);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      updateInputSequence(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!user) {
        const data = await fetchUser();
        setUser(data);
      }
    };

    init();
  }, [user, setUser]);

  return (
    <Container className={isRotating ? "rotate" : ""}>
      <Header />
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={modalVariants}
      >
        <ContentArea>
          <Outlet />
        </ContentArea>
      </motion.div>
      <Footer />
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
            initial="hidden"
            animate="visible"
            exit="hidden"
            drag
            dragConstraints={constraintsRef}
            variants={modalVariants}
            style={{
              position: "absolute", // This makes the div position relative to the nearest positioned ancestor
              top: 0,
              left: 0,
              minWidth: "100vw",
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <Window style={windowStyle}>
              <StyledWindowHeader>
                <Button onClick={handleCloseModal}>
                  <CloseIcon />
                </Button>
              </StyledWindowHeader>
              <WindowContent>
                <div
                  style={{
                    marginBottom: 10,
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <ButtonContainer>
                    <LargeButton onClick={() => handleButtonPress("a")}>
                      A
                    </LargeButton>
                    <LargeButton onClick={() => handleButtonPress("b")}>
                      B
                    </LargeButton>
                  </ButtonContainer>
                </div>
              </WindowContent>
            </Window>
          </motion.div>
        </div>
      )}
    </Container>
  );
};
