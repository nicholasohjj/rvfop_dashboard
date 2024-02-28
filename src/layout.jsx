
    import { Footer } from "./components/footer";
    import { Header } from "./components/header";
    import { Outlet } from 'react-router-dom';

    export const Layout = () => {

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
