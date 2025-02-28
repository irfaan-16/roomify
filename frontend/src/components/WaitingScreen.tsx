/* eslint-disable @typescript-eslint/no-unused-vars */
import { MoveLeftIcon, MoveRightIcon, Play } from "lucide-react";
import Gradient from "/gradient.webp";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import { useRoom } from "./RoomContext";
// import { useRoom } from "./RoomContext";

// interface ConnectedUser {
//   picture: string;
//   name: string;
//   email: string;
// }
// interface Host {
//   picture: string;
//   name: string;
//   email: string;
//   socketId: string;
// }

const WaitingScreen = () => {
  const { session } = useAuth();
  const { socket } = useSocket();
  const { roomId, roomInfo } = useRoom();

  if (session === undefined) {
    return <h1>Loading session...</h1>; // Prevent rendering until session is ready
  }

  if (!session) {
    return <h1>You are not authenticated. Please log in again.</h1>;
  }

  const startMeeting = () => {
    if (!socket) return;
    console.log("starting the meeting");
    socket.emit("startMeeting", roomId);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <img
        src={Gradient}
        alt="gradient image"
        className="absolute -z-2 top-0 pointer-events-none"
      />
      <div className="w-3xl">
        <div className="bg-white/3 rounded-xl p-10 min-w-96">
          <div className="relative flex flex-col items-center bg-black/20 p-8 rounded-xl mb-3 drop-shadow-2xl">
            <div className="absolute rounded-full from-purple-700 to-pink-700 to-bottom bg-linear-to-r top-2 left-2 px-6 text-white">
              <p>host</p>
            </div>
            <img
              src={roomInfo?.host.picture}
              alt="Avatar Image"
              className=" rounded-full"
            />
            <div className="text-center mt-4 pt-3 border-t-4 border-white text-white">
              <h2 className="text-3xl font-bold">{roomInfo?.host.name}</h2>
              <p className="text-white/70">{roomInfo?.host.email}</p>
            </div>
          </div>
          {session.user.user_metadata.email === roomInfo?.host.email && (
            <button
              className="py-4 bg-green-600 text-white cursor-pointer w-full flex items-center rounded-md justify-center gap-2 hover:bg-green-900 transition-all"
              onClick={() => startMeeting()}
            >
              <Play />
              Start Meeting
            </button>
          )}
        </div>

        <div className="mt-4 max-w-[1000px]">
          <h2 className="text-4xl font-bold text-center text-white ">
            Participants
          </h2>

          <div className="flex mt-6 ">
            <div className="rounded-full from-purple-700 to-pink-700 to-bottom bg-linear-to-b cursor-pointer flex items-center px-2 hover:from-purple-900 hover:to-pink-900 transition">
              <MoveLeftIcon color="white" size={18} />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-4 justify-center">
              {roomInfo?.participants.length === 0 ? (
                <h1 className="text-white w-full text-center">
                  No one's around :(
                </h1>
              ) : (
                roomInfo?.participants.map((user) => {
                  return (
                    <div
                      className="flex gap-3 items-center justify-between  rounded-lg bg-white/3 p-3"
                      key={user.email}
                    >
                      <div className="">
                        <img
                          src={user.picture}
                          className="size-10 rounded-full"
                        />
                      </div>
                      <div className="text-white">
                        <h1 className="text-lg">
                          {user.name}{" "}
                          {user.email === session.user.user_metadata.email && (
                            <span className="text-gray-600 text-sm">
                              {" "}
                              (you)
                            </span>
                          )}
                        </h1>
                        <p className="text-xs">{user.email}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="rounded-full from-purple-700 to-pink-700 to-bottom bg-linear-to-b cursor-pointer flex items-center px-2 hover:from-purple-900 hover:to-pink-900 transition">
              <MoveRightIcon color="white" size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingScreen;
