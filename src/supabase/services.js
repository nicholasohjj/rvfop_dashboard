import { supabaseClient } from "./supabaseClient";

const fetchHouses = async () => {
  const { data, error } = await supabaseClient
    .from("houses")
    .select("house_id,name, total_points");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const fetchUser = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();
  if (userError) throw userError;

  return user;
};

const fetchGroup = async () => {
  const user = await fetchUser();

  const { data: fetchedGroupData, error: fetchDataError } =
    await supabaseClient.rpc("get_group_data", { user_id: user.id });


  if (fetchDataError) throw fetchDataError;

  if (fetchedGroupData && fetchedGroupData.length > 0) {
    const group = fetchedGroupData[0]; // Assuming the first group is what you're interested in
    return group;
  }
};

const fetchGroupActivities = async (group_id) => {
  const { data: activityData, error: activityError } = await supabaseClient.rpc(
    "get_activity_data",
    {
      current_group_id: group_id,
    }
  );

  if (activityError) throw activityError;
  activityData.sort((a, b) => new Date(b.tm_created) - new Date(a.tm_created));
  return activityData;
};

const fetchDeductions = async (group_id) => {
  const { data: deductionData, error: deductionError } = await supabaseClient.rpc(
    "get_deductions",
    {
      current_group_id: group_id,
    }
  );

  if (deductionError) throw deductionError;
  deductionData.sort((a, b) => new Date(b.tm_created) - new Date(a.tm_created));
  return deductionData;
};

const fetchActivities = async () => {
  const { data, error } = await supabaseClient.from("activities").select("*");
  if (error) throw error;
  return data;
};

const addActivity = async (activity) => {
  const { data, error } = await supabaseClient
    .from("activities")
    .insert([activity])
    .select("*");
  if (error) throw error;
  return data;
};

const addDeduction = async (deduction) => {
  const { data, error } = await supabaseClient
    .from("deductions")
    .insert([deduction])
    .select("*");
  if (error) throw error;
  return data;
};

const addGroupActivity = async (groupactivity) => {
  const { group_id, activity_id, points_earned } = groupactivity
  const { data, error } = await supabaseClient.from("groupactivities")
  .insert([
    {group_id, activity_id, points_earned
    }])

  if (error) throw error;
return data;
};



export {
  fetchGroupActivities,
  fetchHouses,
  fetchUser,
  fetchGroup,
  fetchActivities,
  addActivity,
  addDeduction,
  addGroupActivity,
  fetchDeductions
};
