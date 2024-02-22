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
  Hourglass,
  GroupBox
} from "react95";
import { supabaseClient } from "../supabase/supabaseClient";
const Group = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState("name"); // Default sort column
  const [sortDirection, setSortDirection] = useState("asc"); // or 'desc'

  useEffect(() => {
    const fetchHouses = async () => {
      const { data, error } = await supabaseClient
        .from("houses")
        .select("house_id, name, total_points");

      if (error) {
        console.error("Error fetching houses:", error.message);
      } else {
        setHouses(data);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchHouses();
  }, []); // Removed 'houses' from the dependency array to prevent infinite loops.

  const sortHouses = (key) => {
    const direction =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(direction);

    const sortedHouses = [...houses].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setHouses(sortedHouses);
  };

  if (loading) {
    return (
      <Window style={{ flex: 1, alignItems: 'center', width: 320 }}>
        <WindowHeader>My Progress</WindowHeader>
        <Hourglass
          size={32}
          style={{ flex: 1, alignItems: "center", margin: 20 }}
        />
      </Window>
    );
  }

  return (
    <Window style={{ flex: 1, width: 320 }}>
      <WindowHeader>My Progress</WindowHeader>
      <WindowContent>
        <GroupBox>
          
        </GroupBox>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {houses.map((house) => (
              <TableRow key={house.house_id}>
                <TableDataCell>{house.name}</TableDataCell>
                <TableDataCell>{house.total_points}</TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </WindowContent>
    </Window>
  );
};
export default Group;
