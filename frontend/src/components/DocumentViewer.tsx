const DocumentViewer = ({ src }: { src: string }) => {
  return (
    <div className="h-full w-full min-h-96">
      <iframe
        src={`http://localhost:4000/uploads/${src}`}
        className="h-full w-full min-h-96"
      />
    </div>
  );
};

export default DocumentViewer;
