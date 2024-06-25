import { useState, useEffect, useRef, useCallback, useMemo, useContext } from "react";
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Window,
  WindowContent,
  WindowHeader,
  Button,
} from "react95";

import { fetchHouses } from "../supabase/services";
import styled from "styled-components";
import { supabaseClient } from "../supabase/supabaseClient";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { LoadingHourglass } from "../components/loadinghourglass";
import { housesContext } from "../context/context";

const useHouses = () => {
  const { houses, setHouses } = useContext(housesContext);
  const sortHousesInitially = useCallback((housesData) => {
    return housesData.sort((a, b) => b.total_points - a.total_points);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (houses.length > 0) return;
      const housesData = await fetchHouses();
      const sortedHouses = sortHousesInitially(housesData);
      setHouses(sortedHouses);
    };

    fetchData();

    const channel = supabaseClient
      .channel("houses")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "houses" },
        (payload) => {
          const updatedHouse = payload.new;
          setHouses((currentHouses) =>
            currentHouses.map((house) =>
              house.house_id === updatedHouse.house_id ? updatedHouse : house
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [sortHousesInitially]);

  return { houses };
};

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
};

const Scoreboard = () => {
  const { houses } = useHouses();
  const windowWidth = useWindowWidth();
  const navigate = useNavigate();
  const constraintsRef = useRef(null);
  const [sortKey, setSortKey] = useState("total_points");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);

  const sortedHouses = useMemo(() => {
    return [...houses].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [houses, sortKey, sortDirection]);

  const handleSort = (key) => {
    setSortKey(key);
    setSortDirection((prevDirection) =>
      sortKey === key && prevDirection === "asc" ? "desc" : "asc"
    );
  };

  const toggleModal = (house) => {
    setSelectedHouse(house);
    setIsModalOpen(!isModalOpen);
  };

  const CloseIcon = styled.div`
    display: inline-block;
    width: 16px;
    height: 16px;
    cursor: pointer;
    transform: rotateZ(45deg);
    position: relative;
    &:before,
    &:after {
      content: "";
      position: absolute;
      background: ${({ theme }) =>
        theme.materialText}; // Adjust the color as needed
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  `;

  const StyledWindowHeader = styled(WindowHeader)`
    color: white; // Adjust the text color as needed for contrast
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  const windowStyle = {
    width: windowWidth > 500 ? 500 : "90%",
    margin: "0%",
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        maxHeight: "100vh",
        position: "relative",
      }}
    >
      <Helmet>
        <title>Insieme 2024 - Scoreboard</title>
        <meta name="description" content="Scoreboard page" />
      </Helmet>
      <Window
        style={{
          flex: 1,
          overflow: "auto",
          minHeight: "100vh",
          maxHeight: "100vh",
        }}
      >
        <WindowHeader onClick={() => navigate("/video")}>
          Scoreboard
        </WindowHeader>
        {houses.length === 0 ? <LoadingHourglass /> : (
          <WindowContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell onClick={() => handleSort("house_name")}>
                    House
                  </TableHeadCell>
                  <TableHeadCell onClick={() => handleSort("total_points")}>
                    Points (Tribal)
                  </TableHeadCell>
                  <TableHeadCell onClick={() => handleSort("pro_human_points")}>
                    Points (Pro-humans)
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedHouses.map((house) => (
                  <TableRow
                    key={house.house_id}
                    onClick={() => toggleModal(house)}
                  >
                    <TableDataCell>{house.house_name}</TableDataCell>
                    <TableDataCell>{house.total_points}</TableDataCell>
                    <TableDataCell>{house.pro_human_points}</TableDataCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </WindowContent>
        )}
      </Window>
      {isModalOpen && (
                    <div
                    ref={constraintsRef}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex", // Use flexbox for centering
                      alignItems: "center", // Vertical center
                      justifyContent: "center", // Horizontal center
                      zIndex: 10, // Ensure it's above other content
                    }}
                  >
              <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              drag
              dragConstraints={constraintsRef}
              variants={modalVariants}
              style={{
                position: "absolute", // This makes the div position relative to the nearest positioned ancestor
                top: 0,
                left: 0,
                minWidth: "100vw",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
              }}
            >
          <Window style={windowStyle}>
            <StyledWindowHeader>
              <span>About {selectedHouse.house_name}</span>
              <Button onClick={() => setIsModalOpen(false)}>
                <CloseIcon />
              </Button>
            </StyledWindowHeader>
            <WindowContent>
              <p
                style={{
                  textAlign: "left",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {selectedHouse.house_name}
              </p>
              <div>
                <img
                  src={selectedHouse.house_logo}
                  alt={`${selectedHouse.house_name}-logo`}
                  width={100}
                  onClick={() => {
                    window.open(selectedHouse.house_ig, "_blank");
                  }}
                />
              </div>

              <p>{selectedHouse.house_description}</p>
            </WindowContent>
          </Window>
        </motion.div>
      </div>
      )}
    </div>
  );
};
export default Scoreboard;
