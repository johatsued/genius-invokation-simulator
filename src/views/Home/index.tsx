import styles from "./index.module.css";

export default function HomePage() {
  return (
    <div className={styles.HomeLayout}>
      <div className={styles.Home}>
        An unofficial simulator for Genius Invokation TCG in Genshin Impact
      </div>
    </div>
  );
}
