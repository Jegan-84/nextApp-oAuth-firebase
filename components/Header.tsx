import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/Header.module.scss";

interface HeaderProps {
  toggleSidebar: () => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  darkMode,
  setDarkMode,
}) => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleProfile = () => {
    setMenuOpen(false);
    router.push("/profile");
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await signOut();
    router.push("/login");
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className={`${styles.header} ${darkMode ? styles.darkMode : ""}`}>
      <div className={styles.headerContent}>
        <div>
          <button className={styles.menuButton} onClick={toggleSidebar}>
            ☰
          </button>
          <Link href="/" className={styles.logo}>
            Project Management
          </Link>
        </div>
        <div className={styles.rightSection}>
          <button className={styles.themeToggle} onClick={handleThemeToggle}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          {user && (
            <div>
              <button className={styles.avatar} onClick={handleMenuToggle}>
                {user.email ? user.email[0].toUpperCase() : "U"}
              </button>
              {menuOpen && (
                <div className={styles.menu}>
                  <Link
                    href="/profile"
                    className={styles.menuItem}
                    onClick={handleProfile}
                  >
                    Profile
                  </Link>
                  <Link
                    href="#"
                    className={styles.menuItem}
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
