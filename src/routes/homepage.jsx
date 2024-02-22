import React, { useState, useEffect } from "react";
import {
  ProgressBar,
} from "react95";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


const HomePage = () => {
  const [percent, setPercent] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((previousPercent) => {
        if (previousPercent === 100) {
          return navigate("/scoreboard");
        }
        const diff = Math.random() * 10;
        return Math.min(previousPercent + diff, 100);
      });
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div style={{flex:1, alignSelf:"center", padding:"25%"}}>
      Loading ...
      <ProgressBar  variant='tile' value={Math.floor(percent)} />
    </div>
  );
};

export default HomePage;
