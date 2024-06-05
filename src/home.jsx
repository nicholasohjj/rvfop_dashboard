import { Footer } from "./components/footer";
import { useStore, initializeUserData } from "./context/userContext";
import { useEffect } from "react";
import styled from "styled-components";
import "./style.css"; // Make sure this points to your CSS file
import Scoreboard from "./routes/scoreboard";

const Container = styled.div`
  flex: 1;
  max-width: 100vw;
  max-height: 100vh;
`;


export const Home = () => {
  const userData = useStore((state) => state.userData);

  useEffect(() => {
    if (!userData) {
      initializeUserData();
    }
  }, [userData]);

  return (
    <Container>
        <Scoreboard />
      <Footer />
    </Container>
  );
};
