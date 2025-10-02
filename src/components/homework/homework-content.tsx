import type { ReactNode } from "react";

interface HomeworkContentProps {
  children: ReactNode;
  className?: string;
}

const BASE_CLASSNAMES =
  "mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 sm:px-8";

const HomeworkContent = ({ children, className }: HomeworkContentProps) => {
  const combinedClassName = className
    ? `${BASE_CLASSNAMES} ${className}`
    : BASE_CLASSNAMES;

  return <div className={combinedClassName}>{children}</div>;
};

export default HomeworkContent;
