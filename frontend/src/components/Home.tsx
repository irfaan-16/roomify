import Gradient from "/gradient.webp";
import Navbar from "./Navbar";
import { CirclePlus, LogIn } from "lucide-react";
import { useSocket } from "./SocketContext";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
// import RoomGenerationModale from "./RoomGenerationModale";
import Features from "./Features";
import toast from "react-hot-toast";
import { useRoom } from "./RoomContext";
import Footer from "./Footer";

function Home() {
  const { socket } = useSocket();
  const { session } = useAuth();
  const { setRoomId } = useRoom();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const createRoom = () => {
    if (!session) {
      toast.error("Please Login to Continue!😤");
      return;
    }

    if (!socket) return;
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    socket.emit("create-room", {
      newRoomId,
      userInfo: {
        picture: session.user.user_metadata.picture,
        name: session.user.user_metadata.name,
        email: session.user.user_metadata.email,
      },
    });
    toast.success("Room created!");
    navigate(`/waiting/${newRoomId}`); // Navigate to ChatRoom with Room ID
  };

  // Join an existing room
  const joinRoom = async () => {
    if (!session) {
      toast.error("Please Login to Continue!😤");
      return;
    }
    if (!socket || !(inputRef?.current?.value as string).trim()) return;
    console.log("joiningggg the room!!");

    socket.emit("join-room", {
      roomId: inputRef.current?.value,
      userInfo: {
        picture: session.user.user_metadata.picture,
        name: session.user.user_metadata.name,
        email: session.user.user_metadata.email,
      },
    });

    const response = await fetch(
      `http://localhost:4000/roomInfo/${inputRef.current?.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();
    if (result.active) {
      navigate(`/room/${result.roomId}`); // Navigate to ChatRoom with Room ID
    } else {
      navigate(`/waiting/${result.roomId}`); // Navigate to ChatRoom with Room ID
    }
  };

  return (
    <div className="relative py-4">
      <img
        src={Gradient}
        alt="gradient image"
        className="absolute -z-2 top-0"
      />
      <Navbar />

      <section className="mt-12 md:min-h-[calc(100vh-300px)] md:flex md:items-center md:justify-center">
        {/* {showDialoag && (
          <RoomGenerationModale
            action={showDialoag}
            desc="use this Room ID to join the meeting"
            link={`https://roomify-hrjc.onrender.com/room/${generatedRoomId}`}
            actionHandler={
              showDialoag === "create"
                ? () =>
                    navigator.clipboard.writeText(
                      `https://roomify-hrjc.onrender.com/room/${generatedRoomId}`
                    )
                : joinRoom
            }
          />
        )} */}
        {/* chip */}
        <div className="flex flex-col gap-6 ">
          <div className="rounded-3xl w-60 md:w-72 lg:w-96 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold tracking-wider py-[5px] text-center m-auto flex justify-between  px-3 items-center">
            <span className="text-2xl drop-shadow-xl">✨</span>
            <p>roomify</p>
            <span className="text-2xl drop-shadow-xl">✨</span>
          </div>

          <h1 className="bg-gradient-to-b from-white  to-black/1 inline-block text-transparent bg-clip-text text-6xl md:text-7xl lg:text-8xl text-center font-bold ">
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
              onClick={() => createRoom()}
            >
              <CirclePlus color="#d00bea" />
              create room
            </button>
            <input
              className="text-white"
              type="text"
              placeholder="Enter Room ID"
              // value={roomId as string}
              // onChange={(e) => setInput(e.target.value)}
              ref={inputRef}
            />

            <button
              className="text-white flex gap-2 bg-gradient-to-b from-white/2 to-white/5  shadow-xl shadow-white/2 py-2 px-4 rounded-md font-bold min-w-40 justify-center cursor-pointer"
              onClick={() => joinRoom()}
            >
              <LogIn color="#d00bea" />
              join room
            </button>
          </div>
        </div>
      </section>
      <Features />
      <Footer />
    </div>
  );
}

export default Home;
