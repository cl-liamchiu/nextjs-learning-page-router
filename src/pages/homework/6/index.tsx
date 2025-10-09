import HomeworkContent from "@/components/homework/homework-content";
import HomeworkDescription from "@/components/homework/homework-description";
import { HWData } from "@/lib/homework/6/data";

const Homework6Page = () => {
  return (
    <HomeworkContent>
      <HomeworkDescription {...HWData} />
    </HomeworkContent>
  );
};

export default Homework6Page;
