interface Summary {
  content: string;
  summary: string;
}

interface PageProps {
  summaries: Summary[];
}

const Summaries = ({ summaries }: PageProps) => {
  console.log(summaries);

  return (
    <div className="bg-white h-full p-2">
      <h1 className="text-2xl">Summaries</h1>

      <div>
        {summaries.map((summary, idx) => {
          return <div key={idx} className="mb-4">{summary.summary}</div>;
        })}
      </div>
    </div>
  );
};

export default Summaries;
