import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/Sidebar.module.scss";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  { title: "Home", icon: HomeIcon, path: "/", roles: ["user", "admin"] },
  {
    title: "Projects",
    icon: AssignmentIcon,
    path: "/ProjectList",
    roles: ["user", "admin"],
  },
  {
    title: "User Management",
    icon: PeopleIcon,
    path: "/user-management",
    roles: ["admin"],
  },
  {
    title: "Customers",
    icon: PeopleIcon,
    path: "/customers",
    roles: ["admin", "user"],
  },
  {
    title: "Audit Logs",
    icon: PeopleIcon,
    path: "/audit-logs",
    roles: ["admin"],
  },
];

interface SidebarProps {
  darkMode: boolean;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode, isOpen }) => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <aside
      className={`${styles.sidebar} ${darkMode ? styles.sidebarDark : ""} `}
    >
      <div className={styles.sidebarHeader}>
        <span className={styles.logo}>Project Management</span>
      </div>
      <nav className={styles.nav}>
        {menuItems
          .filter((item) => user && item.roles.includes(user.role))
          .map((item) => (
            <Link
              href={item.path}
              key={item.title}
              className={`${styles.navItem} ${
                router.pathname === item.path ? styles.active : ""
              }`}
            >
              <item.icon className={styles.navIcon} />
              <span>{item.title}</span>
            </Link>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
