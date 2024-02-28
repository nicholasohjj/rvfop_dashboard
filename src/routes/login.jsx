import { useState, useRef, useEffect } from "react";

import {
  Window,
  WindowHeader,
  WindowContent,
  TextInput,
  Button,
} from "react95";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { supabaseClient } from "../supabase/supabaseClient";

export const Login = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const constraintsRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      supabaseClient.auth.getSession().then(({ data: { session } }) => {
      })

      navigate("/");
    }
    catch (error) {
      alert(error.error_description || error.message);
    }
  };

  const windowStyle = {
    width: windowWidth > 500 ? 500 : '90%', // Adjust width here
    margin: "0%",
  };

  return (
    <div
      ref={constraintsRef}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "rgb(0, 128, 128)",
      }}
    >
      <motion.div drag dragConstraints={constraintsRef} >
      <Window style={windowStyle}>
          <WindowHeader>
            <span>Welcome to Insieme</span>
          </WindowHeader>
          <div style={{ marginTop: 8 }}>
            <img src="https://insieme.s3.ap-southeast-1.amazonaws.com/logo.png" alt="rvrc-logo" width={100} />
          </div>
          <WindowContent>
          <form onSubmit={handleSubmit}>

              <div >
                <div style={{ display: "flex" }}>
                  <TextInput
                    placeholder="Email Address"
                    fullWidth
                    value={email}
                    onChange={(e) => {
                      setemail(e.target.value);
                    }}
                  />
                </div>
                <br />
                <TextInput
                  placeholder="Password"
                  fullWidth
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <br />
                <Button type="submit" value="login">
                  Sign in
                </Button>
              </div>
            </form>
          </WindowContent>
        </Window>
      </motion.div>
    </div>
  );
};
