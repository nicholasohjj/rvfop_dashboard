import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useContext } from "react";
import { fetchUser } from "./supabase/services";
import styled from "styled-components";
import "./style.css"; // Make sure this points to your CSS file
import { userContext } from "./context/context";
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

const ContentArea = styled.div`
  display: flex;
  min-height: 90vh;
  max-height: 90vh;
  padding-top: 48px;
  background-color: rgb(0, 128, 128);
`;

export const Layout = () => {
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

  const konamiCodeMobile = [
    "swipeUp",
    "swipeUp",
    "swipeDown",
    "swipeDown",
    "swipeLeft",
    "swipeRight",
    "swipeLeft",
    "swipeRight",
    "tapB",
    "tapA",
  ];
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(userContext);
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
        updateInputSequence("swipeRight");
      } else {
        updateInputSequence("swipeLeft");
      }
    } else {
      // Vertical swipe
      if (diffY > 0) {
        updateInputSequence("swipeDown");
      } else {
        updateInputSequence("swipeUp");
      }
    }

    touchStartX = 0;
    touchStartY = 0;
  };

  const handleTouchEnd = () => {
    touchStartX = 0;
    touchStartY = 0;
  };

  const updateInputSequence = (input) => {
    setInputSequence((prevSequence) => {
      const newSequence = [...prevSequence, input].slice(-konamiCode.length);
      if (
        newSequence.join(" ") === konamiCode.join(" ") ||
        newSequence.join(" ") === konamiCodeMobile.join(" ")
      ) {
        setIsRotating(true);
        setTimeout(() => setIsRotating(false), 2000); // Reset after 2 seconds
      }
      return newSequence;
    });
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
      setLoading(true);

      if (!user) {
        const data = await fetchUser();
        setUser(data);
      }

      setLoading(false);
    };

    init();
  }, []);

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
    </Container>
  );
};
