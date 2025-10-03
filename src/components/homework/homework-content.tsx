import type { ReactNode } from "react";
import styles from "./homework-content.module.scss";

interface HomeworkContentProps {
  children: ReactNode;
  className?: string;
}

const HomeworkContent = ({ children, className }: HomeworkContentProps) => {
  const combinedClassName = className
    ? `${styles.container} ${className}`
    : styles.container;

  return <div className={combinedClassName}>{children}</div>;
};

export default HomeworkContent;
