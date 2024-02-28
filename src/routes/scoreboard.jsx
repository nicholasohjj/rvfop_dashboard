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
} from "react95";
import { supabaseClient } from "../supabase/supabaseClient";
const Scoreboard = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState("name"); // Default sort column
  const [sortDirection, setSortDirection] = useState("desc"); // Start with points descending

  useEffect(() => {
    const fetchHouses = async () => {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("houses")
        .select("house_id, name, total_points");

      if (error) {
        console.error("Error fetching houses:", error.message);
      } else {
        // Apply initial sort (points DESC, name ASC) immediately after fetch
        const sortedData = data.sort((a, b) => {
          if (a.total_points === b.total_points) {
            return a.name.localeCompare(b.name); // Secondary sort by name ASC
          }
          return b.total_points - a.total_points; // Primary sort by points DESC
        });
        setHouses(sortedData);
      }
      setLoading(false);
    };

    fetchHouses();
  }, []);

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
        <WindowHeader>Scoreboard</WindowHeader>
        <Hourglass
          size={32}
          style={{ flex: 1, alignItems: "center", margin: 20 }}
        />
      </Window>
    );
  }

  return (
    <Window style={{ flex: 1, width: 320 }}>
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
export default Scoreboard;
