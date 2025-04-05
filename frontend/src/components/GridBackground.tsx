const GridBackground = () => {
  return (
    <span className="absolute inset-0 -z-100">
      <span className="mesh absolute inset-0 opacity-10"></span>
      <span className="bg-radial-transparent-to-dark absolute inset-0"></span>
    </span>
  );
};

export default GridBackground;
