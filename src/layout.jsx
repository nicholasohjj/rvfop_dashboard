
    import { Footer } from "./components/footer";
    import { Header } from "./components/header";
    import { supabaseClient } from "./supabase/supabaseClient";
    import { useEffect } from "react";
    import { useNavigate, Outlet } from 'react-router-dom';

    export const Layout = () => {
        const navigate = useNavigate();

        useEffect(() => {
            const checkSession = async () => {
                const { data: { session }, error } = await supabaseClient.auth.getSession();
    
                if (!session && !error) {
                    navigate("/login");
                }
            };
    
            checkSession();
    
            const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
                if (!session) {
                    navigate("/login");
                }
            });
    
        }, [navigate]);

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
