import AuthorizeButton from "@/components/AuthorizeButton/AuthorizeButton";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className={styles.homeContainer}>
        <div className={styles.homeHeader}>
          <h1 className="text-3xl">Spotify</h1>
          <span></span>
        </div>
        <p>
          Third party app for Spotify allowing for faster playlist creation and
          to see your top lists.
        </p>
        <AuthorizeButton />
      </main>
    </>
  );
}
