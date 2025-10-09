import Link from "next/link";
import HomeworkContent from "@/components/homework/homework-content";
import HomeworkDescription from "@/components/homework/homework-description";
import { HWData } from "@/lib/homework/8/data";
import styles from "./index.module.scss";

const Homework8Page = () => {
  return (
    <HomeworkContent>
      <HomeworkDescription {...HWData} />
      <div className={styles.ctaWrapper}>
        <Link href="/homework/8/products" className={styles.ctaLink}>
          Go to Products
        </Link>
      </div>
    </HomeworkContent>
  );
};

export default Homework8Page;
