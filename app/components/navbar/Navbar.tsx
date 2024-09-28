"use client";

import React from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const isHome = () => {
    return pathname === "/";
  };

  return (
    <nav className={styles.navbarContainer}>
      <h3 className="text-2xl">FASTSPOTS</h3>
      {isHome() ? null : (
        <ul>
          <li>
            <Link
              href="/toplists"
              className={pathname === "/toplists" ? styles.activeLink : ""}
            >
              Top Lists
            </Link>
          </li>
          <li>
            <Link
              href="/playlists"
              className={pathname === "/playlists" ? styles.activeLink : ""}
            >
              Playlists
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
