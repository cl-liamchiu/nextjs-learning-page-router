import type { ReactNode } from "react";
import HomeworkSidebar from "./homework-sidebar";
import styles from "./homework-layout.module.scss";

const HomeworkLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.layout}>
      <HomeworkSidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default HomeworkLayout;
