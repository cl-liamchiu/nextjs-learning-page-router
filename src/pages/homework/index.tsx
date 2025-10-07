import HomeworkLayout from "@/components/homework/homework-layout";
import styles from "./index.module.scss";

const HomeworkIndexPage = () => {
  return (
    <HomeworkLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>React Learning Homework</h1>
        <p className={styles.description}>
          Select a homework from the sidebar to begin.
        </p>
      </div>
    </HomeworkLayout>
  );
};

export default HomeworkIndexPage;
