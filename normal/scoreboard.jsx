import React, { useState, useEffect } from "react";
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
} from "react95";
import Loading from "../loading";
import { fetchHouses } from "../../supabase/services";
import styled from "styled-components";
import { supabaseClient } from "../../supabase/supabaseClient";
const Scoreboard = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("overall_points"); // Default sort column to overall_points
  const [sortDirection, setSortDirection] = useState("desc"); // Start with points descending
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);

  useEffect(() => {
    const sortHousesInitially = (housesData) => {
      return [...housesData].sort((a, b) => {
        const aVal = a.total_points;
        const bVal = b.total_points;

        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      });
    };

    fetchHouses().then((housesData) => {
      // After fetching, sort the houses by overall_points in descending order
      const sortedHouses = sortHousesInitially(housesData);
      setHouses(sortedHouses);
      setLoading(false);
    });

    const handleUpdate = (payload) => {
      const updatedHouse = payload.new;
      console.log("Updated house", updatedHouse);
      // Update the state to reflect the changes
      setHouses((currentHouses) => {
        return currentHouses.map((house) =>
          house.house_id === updatedHouse.house_id ? updatedHouse : house
        );
      });
    };

    const channel = supabaseClient
      .channel("houses")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "houses" },
        handleUpdate
      )
      .subscribe();

    // Cleanup function to unsubscribe from the channel
    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [sortDirection]);

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

  const FullScreenModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6); // Semi-transparent background
  `;

  // Mimics the Window component without size constraints
  const StyledModalContent = styled.div`
    background: white;
    padding: 16px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
  `;

  const sortHouses = (key) => {
    const direction =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(direction);

    const sortedHouses = [...houses].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (key === "overall_points") {
        aVal = a.total_points - a.total_penalties;
        bVal = b.total_points - b.total_penalties;
      }

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setHouses(sortedHouses);
  };

  const toggleModal = (house) => {
    setSelectedHouse(house);
    setIsModalOpen(!isModalOpen);
  };

  if (loading) return <Loading />;
  return (
    <div style={{ flex: 1 ,display:"flex", minHeight: "100vh"  }}>
    <Window style={{ flex: 1 }}>
      <WindowHeader>Scoreboard</WindowHeader>
      <WindowContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell onClick={() => sortHouses("name")}>
                House
              </TableHeadCell>
              <TableHeadCell
                onClick={() => sortHouses("total_points")}
                sort={sortKey === "total_points" ? sortDirection : undefined}
              >
                Points
              </TableHeadCell>
              <TableHeadCell
                onClick={() => sortHouses("total_deductions")}
                sort={
                  sortKey === "total_deductions" ? sortDirection : undefined
                }
              >
                Deductions
              </TableHeadCell>
              <TableHeadCell
                onClick={() => sortHouses("overall_points")}
                sort={sortKey === "overall_points" ? sortDirection : undefined}
              >
                Overall Points
              </TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {houses.map((house) => (
              <TableRow key={house.house_id} onClick={() => toggleModal(house)}>
                <TableDataCell>{house.house_name}</TableDataCell>
                <TableDataCell>{house.total_points}</TableDataCell>
                <TableDataCell>{house.total_penalties}</TableDataCell>
                <TableDataCell>
                  {house.total_points - house.total_penalties}
                </TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </WindowContent>
    </Window>
    </div>
  );
};
export default Scoreboard;
