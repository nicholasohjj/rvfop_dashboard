import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useContext } from "react";
import { fetchUser } from "./supabase/services";
import styled from "styled-components";
import "./style.css"; // Make sure this points to your CSS file
import { userContext } from "./context/userContext";
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
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(userContext);
  const [inputSequence, setInputSequence] = useState([]);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      setInputSequence((prevSequence) => {
        const newSequence = [...prevSequence, event.key].slice(
          -konamiCode.length
        );
        if (newSequence.join(" ") === konamiCode.join(" ")) {
          setIsRotating(true);
          setTimeout(() => setIsRotating(false), 2000); // Reset after 2 seconds
        }
        return newSequence;
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
