import { useRoom } from "./RoomContext";
import { useSocket } from "./SocketContext";
import end from "/end.png";

const CallControls = () => {
  const { setRoomId, roomId } = useRoom();
  const { socket } = useSocket();

  const leave = () => {
    if (!socket) return;
    socket.emit("end-room", roomId);

    setRoomId("");
  };

  return (
    <div className="flex w-full justify-evenly max-w-xl m-auto">
      <div
        className="flex items-center gap-2 font-bold text-lg text-white w-fit bg-white/3 py-1 pl-1 pr-4 rounded-full cursor-pointer hover:bg-red-600 transition hover:shadow-2xl shadow-red-700"
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
