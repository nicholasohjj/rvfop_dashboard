import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore, initializeUserData } from "./context/userContext";
import { useEffect, useCallback, useState } from "react";
import styled, { keyframes } from "styled-components";
import "./style.css"; // Make sure this points to your CSS file
import Scoreboard from "./routes/scoreboard";

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

const bounce = keyframes`
  0% { transform: translateX(-100%) scale(0.5); opacity: 0; }
  30% { transform: translateX(0%) scale(1.2); opacity: 1; }
  70% { transform: translateX(50vw) scale(1.2); opacity: 1; }
  100% { transform: translateX(100vw) scale(0.5); opacity: 0; }
`;

const CatAnimation = styled.div`
  position: fixed;
  left: -100%;
  top: 50%;
  animation: ${bounce} 5s linear forwards;
`;

const Container = styled.div`
  flex: 1;
  max-width: 100vw;
  max-height: 100vh;
`;

const ContentArea = styled.div`
  display: flex;
  min-height: 90vh;
  max-height: 90vh;
  padding-top: 48px;
  background-color: rgb(0, 128, 128);
`;

export const Home = () => {
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
  const [inputSequence, setInputSequence] = useState([]);
  const [showCat, setShowCat] = useState(false);

  const handleKeyPress = useCallback((event) => {
    setInputSequence((seq) => {
      let sequence = [...seq, event.key];
      if (sequence.length > konamiCode.length) {
        sequence.shift(); // Keep the array no longer than the Konami Code
      }
      if (JSON.stringify(sequence) === JSON.stringify(konamiCode)) {
        console.log("Konami Code activated!");
        setShowCat(true);
        setTimeout(() => setShowCat(false), 5000); // Adjust time based on animation duration
        sequence = []; // Reset sequence
      }
      return sequence;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const userData = useStore((state) => state.userData);

  useEffect(() => {
    if (!userData) {
      initializeUserData();
    }
  }, [userData]);

  return (
    <Container>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={modalVariants}
      >
        {showCat && (
          <CatAnimation>
            <img
              src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/error.png"
              alt="Dashing Cat"
              style={{ width: "100px" }}
            />
          </CatAnimation>
        )}
        <Scoreboard />
      </motion.div>
      <Footer />
    </Container>
  );
};
