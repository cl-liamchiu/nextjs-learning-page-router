import HomeworkLayout from "@/components/homework/homework-layout";

const HomeworkIndexPage = () => {
  return (
    <HomeworkLayout>
      <div>
        <h1 className="text-3xl font-bold mb-4">React Learning Homework</h1>
        <p>Select a homework from the sidebar to begin.</p>
      </div>
    </HomeworkLayout>
  );
};

export default HomeworkIndexPage;
