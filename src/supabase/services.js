import { supabaseClient } from "./supabaseClient"

const fetchHouses = async () => {
  const { data, error } = await supabaseClient.
  from('houses')
  .select('house_id,name, total_points')
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export { fetchHouses }