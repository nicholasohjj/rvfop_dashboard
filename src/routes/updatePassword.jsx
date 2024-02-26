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

export const UpdatePassword = () => {

  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const constraintsRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
      const checkSession = async () => {
          const { data: { user } } = await supabaseClient.auth.getUser();
          console.log(user)
          setemail(user.email);
      };

      checkSession();

  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password
      });

      if (error) {
        throw error;
      }

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
            <span>Update your password</span>
          </WindowHeader>

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
                  Update
                </Button>
              </div>
            </form>
          </WindowContent>
        </Window>
      </motion.div>
    </div>
  );
};
