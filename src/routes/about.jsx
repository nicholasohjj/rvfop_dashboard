import React, { useMemo } from "react";
import { Window, WindowContent, WindowHeader } from "react95";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  // Memoized helmetProps for meta tags
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
    <div style={{ height: "100vh", width: "100vw", display: "flex" }}>
      <Helmet>
        <title>{helmetProps.title}</title>
        <meta name="description" content={helmetProps.description} />
        <meta name="keywords" content={helmetProps.keywords} />
        <meta name="author" content={helmetProps.author} />
      </Helmet>

      <Window style={{ flex: 1 }}>
        <WindowHeader onClick={() => navigate("/match")}>
          <span>About Insieme 2024</span>
        </WindowHeader>

        <WindowContent style={{ padding: "20px", overflowY: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <img
              src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/logo.png"
              alt="rvrc-logo"
              width={100}
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.open("https://www.instagram.com/rvrc", "_blank");
              }}
            />
          </div>

          <p style={{ textAlign: "left" }}>
            Welcome to the Freshmen Orientation Programme (FOP) AY24/25 at RVRC!
            Embrace an unforgettable journey where freshmen from the 7 tribal
            houses unite under the theme "Insieme" (Italian for "together").
            Join us as we celebrate RVRC's 10th anniversary with immersive
            activities, fostering camaraderie, teamwork, and environmental
            stewardship. Navigate challenges, forge alliances, and assemble the
            Quark-Working Enthalpy Energiser Nuke (QWEEN) to secure victory.
            Discover your role in this epic narrative and integrate into RVRC's
            vibrant community through engaging gameplay and vibrant,
            anime-inspired visuals. Welcome to a journey of unity, resilience,
            and lasting memories.
          </p>

          <p style={{ marginBottom: "1em", textAlign: "center" }}>
            © 2024 Insieme. All rights reserved.
          </p>

          <p style={{ marginBottom: 0, textAlign: "center" }}>
            Website designed by Nicholas Oh.
          </p>
        </WindowContent>
      </Window>
    </div>
  );
};

export default About;
