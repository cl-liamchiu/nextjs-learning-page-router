import styles from "./index.module.scss";

const HomeworkIndexPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>React Learning Homework</h1>
      <p className={styles.description}>
        Select a homework from the sidebar to begin.
      </p>
    </div>
  );
};

export default HomeworkIndexPage;
