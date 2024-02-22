import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tygfzfyykirshnanbprr.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5Z2Z6Znl5a2lyc2huYW5icHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzNTgyNjUsImV4cCI6MjAyMTkzNDI2NX0.sVaq8OpUPK1Fb0S9nMTgcgE_JRRL0_dB4fp6_8FmhJs";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
    db: {
        schema: "public",
    },
    auth: {
        persistSession: true,
    },
});
