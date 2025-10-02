import type { ReactNode } from "react";
import HomeworkSidebar from "./homework-sidebar";

const HomeworkLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <HomeworkSidebar />
      <main className="flex w-full flex-1 justify-center p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
};

export default HomeworkLayout;
