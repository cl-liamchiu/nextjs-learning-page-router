interface HomeworkDescriptionProps {
  title: string;
  contentBasic: React.ReactNode;
  contentAdvanced: React.ReactNode;
}

const HomeworkDescription = ({
  title,
  contentBasic,
  contentAdvanced,
}: HomeworkDescriptionProps) => {
  return (
    <div className="max-w-lg mx-auto my-8 px-8 py-6 rounded-2xl text-white border border-white bg-gray-500 bg-opacity-50">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="text-left mb-8">
        <span className="px-2 py-1 rounded-md font-bold">Basic requirement:</span>
        {contentBasic}
        <span className="px-2 py-1 rounded-md font-bold">Advanced:</span>
        {contentAdvanced}
      </div>
    </div>
  );
};

export default HomeworkDescription;
