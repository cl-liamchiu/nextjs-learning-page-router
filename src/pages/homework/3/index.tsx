import Link from "next/link";
import HomeworkLayout from "@/components/homework/homework-layout";
import HomeworkContent from "@/components/homework/homework-content";
import HomeworkDescription from "@/components/homework/homework-description";
import { HWData } from "@/lib/homework/3/data";
import styles from "./index.module.scss";

const Homework3IndexPage = () => {
  return (
    <HomeworkLayout>
      <HomeworkContent>
        <HomeworkDescription {...HWData} />
        <div className={styles.ctaWrapper}>
          <Link href="/homework/3/post-board" className={styles.ctaLink}>
            Go to Post Board
          </Link>
        </div>
      </HomeworkContent>
    </HomeworkLayout>
  );
};

export default Homework3IndexPage;
