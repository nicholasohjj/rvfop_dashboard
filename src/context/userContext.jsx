import { create } from 'zustand'

// Assuming fetchUser is an async function from your services
import { fetchUser } from '../supabase/services'

export const useStore = create((set) => ({
  userData: null, // Initial state can be null or some default value
  setUserData: (userData) => set({ userData }), // Action to update userData
}));

// Usage example outside the store definition:
export const initializeUserData = async () => {
  const userData = await fetchUser();
  useStore.getState().setUserData(userData);
};

initializeUserData(); // Call this function to initialize the userData
