import { supabaseClient } from "./supabaseClient";

const fetchHouses = async () => {
  const { data, error } = await supabaseClient.from("houses").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const fetchChannels = async () => {
  const { data, error } = await supabaseClient.from("channels").select("channel").eq("is_active", true);
  if (error) {
    throw new Error(error.message);
  }
  //sort by channel name
  data.sort((a, b) => a.channel.localeCompare(b.channel));
  return data.map(channel => channel.channel);
}

const fetchMessages = async (input_channel) => {
  const { data, error } = await supabaseClient.rpc("fetch_messages", { input_channel });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

const fetchPrivateMessages = async (input_channel) => {
  const { data, error } = await supabaseClient.rpc("fetch_private_messages", { input_channel });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

const fetchUser = async () => {
  const { data: user } = await supabaseClient.auth.getUser();
  const userId = user.user.id;

  const { data, error } = await supabaseClient.rpc("get_profile");

  console.log("User", data, error);
  return data;
};

const fetchGroups = async () => {
  const { data, error } = await supabaseClient.from("groups").select("*");
  if (error) throw error;
  data.sort((a, b) => a.group_name.localeCompare(b.group_name));
  return data;
};

const fetchGroup = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();
  if (userError) throw userError;

  const { data: fetchedGroupData, error: fetchDataError } =
    await supabaseClient.rpc("get_group_data", { user_id: user.id });

  if (fetchDataError) throw fetchDataError;

  if (fetchedGroupData && fetchedGroupData.length > 0) {
    const group = fetchedGroupData[0]; // Assuming the first group is what you're interested in
    console.log("Group", group);
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

  console.log("Activities", activityData, activityError);

  if (activityError) throw activityError;
  activityData.sort((a, b) => new Date(b.tm_created) - new Date(a.tm_created));
  return activityData;
};

const fetchDeductions = async (group_id) => {
  const { data: deductionData, error: deductionError } =
    await supabaseClient.rpc("get_deductions", {
      current_group_id: group_id,
    });

  if (deductionError) throw deductionError;
  deductionData.sort((a, b) => new Date(b.tm_created) - new Date(a.tm_created));
  return deductionData;
};

const fetchActivities = async () => {
  const { data, error } = await supabaseClient.from("activities").select("*");
  if (error) throw error;
  return data;
};

const fetchAwardedGames = async (gm_id) => {
  const { data, error } = await supabaseClient.rpc("get_awarded_games", {
    gm_id,
  });
  if (error) throw error;

  console.log("Awarded Games", data);

  // sort by date then group_name alphabetically
  data.sort((a, b) => {
    if (a.tm_created < b.tm_created) return 1;
    if (a.tm_created > b.tm_created) return -1;
    if (a.group_name < b.group_name) return -1;
    if (a.group_name > b.group_name) return 1;
    return 0;
  });
  return data;
};

const addActivity = async (activity) => {
  console.log("Activity", activity);
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
  const { data, error } = await supabaseClient
    .from("groupactivities")
    .insert([{ ...groupactivity }]);

  if (error) throw error;
  return data;
};

export {
  fetchGroupActivities,
  fetchHouses,
  fetchUser,
  fetchGroup,
  fetchGroups,
  fetchActivities,
  addActivity,
  addDeduction,
  addGroupActivity,
  fetchDeductions,
  fetchAwardedGames,
  fetchChannels,
  fetchMessages,
  fetchPrivateMessages
};
