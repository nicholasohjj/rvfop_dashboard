import { useState, useRef } from "react";

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
  const [email, setemail] = useState("e1234567@u.nus.edu");
  const [password, setPassword] = useState("ensieme-supabase");
  const constraintsRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation

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
        console.log(session);
      })

      navigate("/");
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
            <img src="../../images/logo.png" alt="rvrc-logo" width={100} />
          </div>
          <WindowContent>
          <form onSubmit={handleSubmit}>

              <div style={{ width: 500 }}>
                <div style={{ display: "flex" }}>
                  <TextInput
                    placeholder="User Name"
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
