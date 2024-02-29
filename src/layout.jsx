import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div style={{ flex: 1,
        maxWidth: "100vw",
        maxHeight: "100vh",
    }}>
      <Header />
      <div
        style={{
          display: "flex", // Make this a flex container
          minHeight: "90vh",
          maxHeight: "90vh",
          paddingTop: "48px",
          backgroundColor: "rgb(0, 128, 128)",
        }}
      >
        <Outlet /> {/* This content will now expand to fill available space */}
      </div>
      <Footer />
    </div>
  );
};
