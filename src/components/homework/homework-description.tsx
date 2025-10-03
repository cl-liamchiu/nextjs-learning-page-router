import styles from "./homework-description.module.scss";

interface HomeworkDescriptionProps {
  title: string;
  contentBasic: React.ReactNode;
  contentAdvanced: React.ReactNode;
}

const HomeworkDescription = ({
  title,
  contentBasic,
  contentAdvanced,
}: HomeworkDescriptionProps) => {
  return (
    <section className={styles.description}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>
        <div className={styles.section}>
          <span className={styles.badge}>Basic requirement:</span>
          {contentBasic}
        </div>
        <div className={styles.section}>
          <span className={styles.badge}>Advanced:</span>
          {contentAdvanced}
        </div>
      </div>
    </section>
  );
};

export default HomeworkDescription;
