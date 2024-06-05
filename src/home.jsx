import { Footer } from "./components/footer";
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

  return (
    <Container>
        <Scoreboard />
      <Footer />
    </Container>
  );
};
