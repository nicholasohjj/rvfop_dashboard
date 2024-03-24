import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore, initializeUserData } from "./context/userContext";
import { useEffect } from "react";


const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};


export const Layout = () => {

  const userData = useStore((state) => state.userData);

  useEffect(() => {
    if (!userData) {
      initializeUserData()
  }}, [userData]);
  
  return (
    <div style={{ flex: 1, maxWidth: "100vw", maxHeight: "100vh" }}>
      <Header />
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={modalVariants}
      >
        <div
          style={{
            display: "flex", // Make this a flex container
            minHeight: "90vh",
            maxHeight: "90vh",
            paddingTop: "48px",
            backgroundColor: "rgb(0, 128, 128)",
          }}
        >
          <Outlet />
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};
