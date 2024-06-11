import { supabaseClient } from "./supabaseClient";

const fetchHouses = async () => {
  const { data, error } = await supabaseClient.from("houses").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const fetchChannels = async () => {
  const { data, error } = await supabaseClient
    .from("channels")
    .select("channel")
    .eq("is_active", true);
  if (error) {
    throw new Error(error.message);
  }
  //sort by channel name
  data.sort((a, b) => a.channel.localeCompare(b.channel));
  return data.map((channel) => channel.channel);
};

const fetchMembers = async (group_id) => {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("group_id", group_id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


const fetchMessages = async (input_channel) => {
  const { data, error } = await supabaseClient
    .from("messages")
    .select(
      `
  message_id,
  tm_created,
  channel,
    message,
    user_id,
    profiles:user_id (
      profile_name
    )
  `
    )
    .eq("channel", input_channel);
  if (error) {
    throw new Error(error.message);
  }

  //flatten the data
  data.forEach((message) => {
    message.profile_name = message.profiles.profile_name;
    delete message.profiles;
  });

  return data;
};

const fetchPrivateMessages = async (match_id) => {
  const { data, error } = await supabaseClient
    .from("private_messages")
    .select(
      `
  message_id,
  tm_created,
  match_id,
    message,
    user_id,
    profiles:user_id (
      profile_name
    )
  `
    )
    .eq("match_id", match_id);
  if (error) {
    throw new Error(error.message);
  }

  //flatten the data
  data.forEach((message) => {
    message.profile_name = message.profiles.profile_name;
    delete message.profiles;
  });

  return data;
};

const fetchUser = async () => {
  const { data, error } = await supabaseClient.rpc("get_profile");
  return data;
};

const fetchOtherUser = async (user_id) => {
  try {
    const { data, error } = await supabaseClient.from("profiles").select("*").eq("id", user_id).single();

    if (error) {
      return null;
    }

    return data;
  }
  catch (error) {    
    
    return null;
  }

}

const fetchGroups = async () => {
  const { data, error } = await supabaseClient.from("groups").select("*");
  if (error) throw error;
  data.sort((a, b) => a.group_name.localeCompare(b.group_name));
  return data;
};

const fetchGroup = async (group_id) => {
  const { data, error } = await supabaseClient
    .from("groups")
    .select("*")
    .eq("group_id", group_id);
  if (error) throw error;
  return data[0];
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
  const { data: deductionData, error: deductionError } = await supabaseClient
    .from("deductions")
    .select("*, groups:deducted_group_id ( group_id, group_name ) ")
    .eq("group_id", group_id);

  if (deductionError) throw deductionError;
  deductionData.sort((a, b) => new Date(b.tm_created) - new Date(a.tm_created));
  return deductionData;
};

const fetchRoles = async () => {
  const { data, error } = await supabaseClient
    .from("roles")
    .select("*")
    .eq("is_active", true);

  if (error) throw error;
  return data;
};

const fetchDeductedDeductions = async (group_id) => {
  try {

    const { data: deductionData, error: deductionError } = await supabaseClient
      .from("deductions")
      .select("*");

    if (deductionError) {
      throw new Error(`Error fetching deductions: ${deductionError.message}`);
    }

    // Filter out deductions that are not for the current group
    const filteredDeductions = deductionData.filter(
      (deduction) => deduction.deducted_group_id === group_id
    );


    // Sort filtered deductions by creation time
    filteredDeductions.sort(
      (a, b) => new Date(b.tm_created) - new Date(a.tm_created)
    );

    return filteredDeductions;
  } catch (error) {
    console.error("Error in fetchDeductedDeductions:", error);
    throw error;
  }
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
  fetchMembers,
  fetchActivities,
  addActivity,
  addDeduction,
  addGroupActivity,
  fetchDeductions,
  fetchAwardedGames,
  fetchChannels,
  fetchRoles,
  fetchMessages,
  fetchPrivateMessages,
  fetchDeductedDeductions,
  fetchOtherUser
};
