import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useContext } from "react";
import { fetchUser } from "./supabase/services";
import styled from "styled-components";
import "./style.css"; // Make sure this points to your CSS file
import { supabaseClient } from "./supabase/supabaseClient";
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
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const {user, setUser} = useContext(userContext);


  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      setSession(session);
      // Set loading to false after the session check

      if (!user) {
        console.log("No user here!");
        const data = await fetchUser();
        console.log("User here!", data);

        setUser(data);
      }

      setLoading(false);



    };

    checkSession();




  }, []);

  return (
    <Container>
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
