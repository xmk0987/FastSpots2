"use client";
import React from "react";
import styles from "./AuthorizeButton.module.css";

const AuthorizeButton: React.FC = () => {
  const handleAuthorize = () => {
    window.location.href = "/api/spotify/authorize";
  };

  return (
    <button className={styles.authorize} onClick={handleAuthorize}>
      Authorize
    </button>
  );
};

export default AuthorizeButton;
