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

  return user
}

const fetchGroup = async () => {
  const user = await fetchUser();

  const { data: fetchedGroupData, error: fetchDataError } =
    await supabaseClient.rpc("fetch_group_data", { user_id: user.id });

  if (fetchDataError) throw fetchDataError;

  if (fetchedGroupData && fetchedGroupData.length > 0) {
    const group = fetchedGroupData[0]; // Assuming the first group is what you're interested in
    return group;
  }
};

const fetchActivities = async () => {
  const { data, error } = await supabaseClient.from("activities").select("*");
  if (error) throw error;
  return data;
};

export { fetchHouses, fetchUser, fetchGroup, fetchActivities };
