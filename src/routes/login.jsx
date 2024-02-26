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
  const constraintsRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
      const checkSession = async () => {
          const { data: { session }, error } = await supabaseClient.auth.getSession();

          if (session) {
              navigate("/");
          }
      };

      checkSession();

      const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
          if (session) {
              navigate("/updatepassword");
          }
      });

  }, [navigate]);

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabaseClient.auth.signInWithOtp({
        email,
        options: { redirectTo: "http://localhost:5173/updatepassword" },
      });

      if (error) {
        throw error;
      }
    }
    catch (error) {
      alert(error.error_description || error.message);
    }
  };

  return (
    <div
      ref={constraintsRef}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "rgb(0, 128, 128)",
      }}
    >
      <motion.div drag dragConstraints={constraintsRef}>
        <Window>
          <WindowHeader>
            <span>Welcome to Insieme</span>
          </WindowHeader>
          <div style={{ marginTop: 8 }}>
            <img src="https://insieme.s3.ap-southeast-1.amazonaws.com/logo.png" alt="rvrc-logo" width={100} />
          </div>
          <WindowContent>
          <form onSubmit={handleSubmit}>

              <div style={{ width: 500 }}>
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
