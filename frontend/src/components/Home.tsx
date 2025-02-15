import Gradient from "/gradient.webp";
import Navbar from "./Navbar";
import { CirclePlus, LogIn } from "lucide-react";
import { useSocket } from "./SocketContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import RoomGenerationModale from "./RoomGenerationModale";

function Home() {
  const { socket } = useSocket();
  const { session } = useAuth();
  // let currentRoomId: number;
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const [showDialoag, setShowDialog] = useState<string | null>(null);

  const createRoom = () => {
    if (!socket) return;
    // const newRoomId = uuidv4().slice(0, 8); // Shorten UUID for simplicity
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    socket.emit("create-room", newRoomId);
    // navigate(`/room/${newRoomId}`); // Navigate to ChatRoom with Room ID
  };

  // Join an existing room
  const joinRoom = () => {
    if (!socket) return;
    if (!roomId.trim()) return;
    socket.emit("join-room", {
      roomId,
      userInfo: {
        picture: session.user.user_metadata.picture,
        name: session.user.user_metadata.name,
        email: session.user.user_metadata.email,
      },
    });
    navigate(`/room/${roomId}`); // Navigate to ChatRoom with Room ID
  };

  const handleClick = (action: string) => {
    setShowDialog(action);
    if (action === "create") {
      createRoom();
    }
  };

  useEffect(() => {
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  }, [navigate]);

  return (
    <div className="py-4 relative ">
      <img
        src={Gradient}
        alt="gradient image"
        className="absolute -z-2 top-0"
      />
      <Navbar />

      <section className="mt-12 md:min-h-[calc(100vh-300px)] md:flex md:items-center md:justify-center">
        {showDialoag && (
          <RoomGenerationModale
            action={showDialoag}
            desc="use this Room ID to join the meeting"
            link={`https://roomify-hrjc.onrender.com/room/${roomId}`}
            actionHandler={
              showDialoag === "create"
                ? () =>
                    navigator.clipboard.writeText(
                      `https://roomify-hrjc.onrender.com/room/${roomId}`
                    )
                : joinRoom
            }
          />
        )}
        {/* chip */}
        <div className="flex flex-col gap-6 ">
          <div className="rounded-3xl w-60 md:w-72 lg:w-96 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold tracking-wider py-[5px] text-center m-auto flex justify-between  px-3 items-center">
            <span className="text-2xl drop-shadow-xl">✨</span>
            <p>roomify</p>
            <span className="text-2xl drop-shadow-xl">✨</span>
          </div>

          <h1 className="bg-gradient-to-b from-white to-black/2 inline-block text-transparent bg-clip-text text-5xl md:text-6xl lg:text-8xl text-center font-bold ">
            Collaborate, Learn, and
            <br /> Succeed Together.
          </h1>
          <p className="text-white/50 text-center font-bold md:text-xl lg:text-2xl">
            Step into a collaborative world of learning.
            <br /> Connect and grow together in a space designed to make
            studying engaging
          </p>

          <div className="flex gap-4 m-auto w-fit">
            <button
              className="text-white flex gap-2 bg-gradient-to-b from-white/2 to-white/5  shadow-xl shadow-white/2 py-2 px-4 rounded-md font-bold min-w-40 justify-center cursor-pointer"
              onClick={() => handleClick("create")}
            >
              <CirclePlus color="#d00bea" />
              create room
            </button>
            <input
              className="text-white"
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />

            <button
              className="text-white flex gap-2 bg-gradient-to-b from-white/2 to-white/5  shadow-xl shadow-white/2 py-2 px-4 rounded-md font-bold min-w-40 justify-center cursor-pointer"
              onClick={() => handleClick("join")}
            >
              <LogIn color="#d00bea" />
              join room
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
