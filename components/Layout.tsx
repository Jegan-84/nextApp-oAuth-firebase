import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styles from "../styles/Layout.module.scss";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(false);
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className={styles.layout}>
      <Sidebar darkMode={darkMode} isOpen={false} />
      <div className={`${styles.mainContent}`}>
        <Header
          toggleSidebar={toggleSidebar}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
