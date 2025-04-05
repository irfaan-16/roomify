import { useRoom } from "./RoomContext";
import end from "/end.png";
import mic from "/mic.png";
// import { useRoom } from "./RoomContext";

const CallControls = () => {
  const { setRoomId } = useRoom();
  const leave = () => {
    setRoomId("");
  };

  return (
    <div className="flex w-full justify-evenly max-w-xl m-auto">
      <div className="flex items-center gap-2 font-bold text-lg text-white w-fit bg-white/3 py-1 pl-1 pr-4 rounded-full cursor-pointer">
        <div className="bg-black  rounded-full p-1">
          <img src={mic} className="size-9" />
        </div>
        <p>mic</p>
      </div>

      <div
        className="flex items-center gap-2 font-bold text-lg text-white w-fit bg-white/3 py-1 pl-1 pr-4 rounded-full cursor-pointer"
        onClick={leave}
      >
        <div className="bg-black  rounded-full p-1">
          <img src={end} className="size-9" />
        </div>
        <p>end</p>
      </div>
    </div>
  );
};

export default CallControls;
