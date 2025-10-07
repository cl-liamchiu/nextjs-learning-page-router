"use client";

import HomeworkContent from "@/components/homework/homework-content";
import HomeworkDescription from "@/components/homework/homework-description";
import ImageZoomDemo from "@/lib/homework/5/image-zoom-demo";
import { HWData } from "@/lib/homework/5/data";

const Homework5Page = () => {
  return (
    <HomeworkContent>
      <HomeworkDescription {...HWData} />
      <ImageZoomDemo />
    </HomeworkContent>
  );
};

export default Homework5Page;
