import React, { useMemo } from "react";
import { Anchor, Window, WindowContent, WindowHeader } from "react95";
import { Helmet } from "react-helmet";
const About = () => {
  const helmetProps = useMemo(
    () => ({
      title: "Insieme 2024 - About",
      description: "Learn more about Insieme 2024",
      keywords: "Insieme, 2024, About, Nicholas Oh",
      author: "Nicholas Oh",
    }),
    []
  );

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
        <title>{helmetProps.title}</title>
        <meta name="description" content={helmetProps.description} />
        <meta name="keywords" content={helmetProps.keywords} />
        <meta name="author" content={helmetProps.author} />
      </Helmet>
      <Window
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <WindowHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>About Insieme 2024</span>
        </WindowHeader>
        <WindowContent
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p style={{ marginBottom: "1em" }}>
            © 2024 Insieme. All rights reserved.
          </p>
          <p style={{ textAlign: "center" }}>
            Website designed by{" "}
            <Anchor
              href="https://www.linkedin.com/in/nicholasohjj"
              target="_blank"
              rel="noopener noreferrer"
            >
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
