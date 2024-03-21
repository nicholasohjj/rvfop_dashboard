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
import Loading from "./loading";
import { fetchHouses } from "../supabase/services";
const Scoreboard = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState("name"); // Default sort column
  const [sortDirection, setSortDirection] = useState("desc"); // Start with points descending
  useEffect(() => {
    Promise.all([fetchHouses()]).then(([housesData]) => {
      console.log(housesData)
      setHouses(housesData);
      setLoading(false);
    });
  }, []);

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

  if (loading) return <Loading />;
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
              <TableHeadCell
                onClick={() => sortHouses("total_deductions")}
                sort={sortKey === "total_deductions" ? sortDirection : undefined}
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
              <TableRow key={house.house_id}>
                <TableDataCell>{house.name}</TableDataCell>
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
  );
};
export default Scoreboard;
