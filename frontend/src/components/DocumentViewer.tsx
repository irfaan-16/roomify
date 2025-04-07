const DocumentViewer = ({ src }: { src: string }) => {
  return (
    <div className="h-full w-full min-h-96">
      <iframe src={`/uploads/${src}`} className="h-full w-full min-h-96" />
    </div>
  );
};

export default DocumentViewer;
