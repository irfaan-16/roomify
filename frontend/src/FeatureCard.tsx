const FeatureCard = ({
  direction,
  title,
  desc,
  image,
}: {
  direction: string;
  title: string;
  desc: string;
  image: string;
}) => {
  return (
    <div
      className={`bg-white/2 p-4 rounded-md flex items-center text-white ${
        direction === "right" ? "flex-col-reverse" : "flex-col"
      } md:flex-row`}
    >
      <div
        className={`bg-black/60 rounded-md px-18 py-8 ${
          direction === "left" && "hidden"
        } `}
      >
        <img src={image} className="h-60 rounded-2xl object-contain" />
      </div>

      <div className=" p-10">
        <h1 className="text-5xl font-extrabold whitespace-pre text-center">
          {title}
        </h1>
        <p className="max-w-xl mt-4 text-xl text-center">{desc}</p>
      </div>
      <div
        className={`bg-black/60 rounded-md px-18 py-8  ${
          direction === "right" && "hidden"
        }`}
      >
        <img src={image} className="h-60 object-contain" />
      </div>
    </div>
  );
};

export default FeatureCard;
