import { Anchor, Window, WindowContent, WindowHeader } from "react95";
import { Helmet } from "react-helmet";
const About = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        position: "relative",
      }}
    >
      <Helmet>
        <title>Insieme 2024 - About</title>
        <meta name="description" content="about" />
      </Helmet>
      <Window
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <WindowHeader>About</WindowHeader>
        <WindowContent
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>© 2024 Insieme. All rights reserved.</p>
          <p>
            Website designed by{" "}
            <Anchor href="https://www.linkedin.com/in/nicholasohjj">
              Nicholas Oh
            </Anchor>
            .
          </p>
        </WindowContent>
      </Window>
    </div>
  );
};

export default About;
