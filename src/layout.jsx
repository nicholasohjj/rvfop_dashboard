
    import { Footer } from "./components/footer";
    import { Header } from "./components/header";
    import { supabaseClient } from "./supabase/supabaseClient";
    import { useState, useEffect } from "react";
    import { useNavigate, Outlet } from 'react-router-dom';

    export const Layout = () => {
        const [session, setSession] = useState(null);
        const navigate = useNavigate();

        useEffect(() => {
            supabaseClient.auth.getSession().then(({ data: { session } }) => {
                setSession(session)
            })
        
            supabaseClient.auth.onAuthStateChange((_event, session) => {
                setSession(session)
            })


            // Redirect if session is not found


        }, [session, navigate]); // Depend on `session` and `navigate` to rerun this effect

        if (!session) {
            // This will handle the initial state before the useEffect hook runs
            // It's necessary because the initial `session` state is null
            // And we don't want to return anything until the session check completes
        }

        return (
            <div style={{flex:1}}>
                <Header />
                <div style={{
            display: "flex", // Make this a flex container
            flexDirection: "column", // Arrange children in a column
            minHeight: "100vh", // Minimum height to fill the viewport height
            backgroundColor: "rgb(0, 128, 128)",
            paddingTop: "48px",
        }}>
            <div style={{ flex: 1, display: "flex", backgroundColor: "rgb(0, 128, 128)" }}>
                <Outlet /> {/* This content will now expand to fill available space */}
            </div>
                </div>
                <Footer />
            </div>
        );
    };
