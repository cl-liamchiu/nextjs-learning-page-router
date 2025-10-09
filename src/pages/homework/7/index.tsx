import HomeworkContent from "@/components/homework/homework-content";
import HomeworkDescription from "@/components/homework/homework-description";
import { HWData } from "@/lib/homework/7/data";
import TodosPage from "@/lib/homework/7/todos";

const Homework7Page = () => {
  return (
    <HomeworkContent>
      <HomeworkDescription {...HWData} />
      <TodosPage />
    </HomeworkContent>
  );
};

export default Homework7Page;
