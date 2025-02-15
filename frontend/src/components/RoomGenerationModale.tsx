interface PageProps {
  action: string;
  desc: string;
  link: string;
  actionHandler: () => void;
}

const RoomGenerationModale = ({
  action,
  desc,
  link,
  actionHandler,
}: PageProps) => {
  return (
    <div className="bg-black w-xl text-white p-10 rounded-md m-10 absolute  top-1/2 -translate-y-1/2 shadow-2xl">
      <h1 className="text-4xl font-bold">{action} a room</h1>
      <p className="my-4 text-white/40">{desc}</p>
      <div className="h-12 pl-6 pr-2 bg-white/5 rounded-md flex justify-between items-center">
        {action === "create" ? (
          <input className="font-bold w-full" value={link} readOnly />
        ) : (
          <input type="text" className="font-bold w-full" />
        )}
        <div
          className="bg-black p-1 w-20 rounded-md text-center cursor-pointer"
          onClick={actionHandler}
        >
          <p className="text-lg -mt-1 font-bold">
            {action === "create" ? "copy" : "join"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomGenerationModale;
