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
  GroupBox,
} from "react95";
import { supabaseClient } from "../supabase/supabaseClient";
const Progress = () => {
  const [user, setUser] = useState();
  const [groupData, setGroupData] = useState(null); // Initialize to null for better checks
  const [ActivityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroupData = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();
      if (userError) throw userError;
      setUser(user);

      // Updated query to match the requirement
      const { data: fetchedData, error: fetchDataError } =
        await supabaseClient.rpc("fetch_group_data", { user_id: user.id }); // Assuming you have a stored procedure for this complex join

      if (fetchDataError) throw fetchDataError;

      setGroupData(fetchedData[0]);
      await fetchActivityData();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      console.log(groupData);
      setLoading(false);
    }
  };

  const fetchActivityData = async () => {
    try {
      // Updated query to match the requirement
      let { data, error } = await supabaseClient.rpc("get_activity_data", {
        group_id: groupData.group_id,
      }); // Assuming you have a stored procedure for this complex join

      if (error) throw error;
      setActivityData(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      console.log("Activity data: ", ActivityData);
      setLoading(false);
    }
    console.log("Activity data: ", ActivityData);
  };

  useEffect(() => {
    setLoading(true);
    const fetchGroupAndActivityData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabaseClient.auth.getUser();
        if (userError) throw userError;
        setUser(user);

        const { data: fetchedGroupData, error: fetchDataError } =
          await supabaseClient.rpc("fetch_group_data", { user_id: user.id });

        if (fetchDataError) throw fetchDataError;

        if (fetchedGroupData && fetchedGroupData.length > 0) {
          const group = fetchedGroupData[0]; // Assuming the first group is what you're interested in
          setGroupData(group);

          const { data: activityData, error: activityError } =
            await supabaseClient.rpc("get_activity_data", {
              current_group_id: group.group_id,
            });

          if (activityError) throw activityError;
          setActivityData(activityData);
          console.log("Activity data: ", activityData);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupAndActivityData();
  }, []);

  if (loading) {
    return (
      <Window style={{ flex: 1, alignItems: "center", width: 320 }}>
        <WindowHeader>My Progress</WindowHeader>
        <Hourglass
          size={32}
          style={{ flex: 1, alignItems: "center", margin: 20 }}
        />
      </Window>
    );
  }

  // Helper function to convert UTC to SGT and format to "day-month"
  const formatSGT = (utcString) => {
    const utcDate = new Date(utcString);
    // Convert UTC date to SGT (UTC+8)
    const sgtDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000);
    // Format date to "day-month" using Intl.DateTimeFormat
    return new Intl.DateTimeFormat("en-SG", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(sgtDate);
  };

  return (
    <Window style={{ flex: 1, width: 320 }}>
      <WindowHeader>My Progress</WindowHeader>
      <WindowContent>
        <GroupBox label={`Group: ${groupData.name}`}>
          Total Points Earned: {groupData.total_points}
        </GroupBox>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Day</TableHeadCell>
              <TableHeadCell>Activity</TableHeadCell>
              <TableHeadCell>Points</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ActivityData.map((activity, index) => (
              <TableRow key={index}>
                <TableDataCell>{formatSGT(activity.tm_created)}</TableDataCell>
                <TableDataCell>{activity.name}</TableDataCell>
                <TableDataCell>{activity.points_earned}</TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </WindowContent>
    </Window>
  );
};
export default Progress;
