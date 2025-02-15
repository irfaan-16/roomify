import { useSocket } from "./SocketContext";

const ConnectedUsersList = () => {
  // const [joinedMembers, setJoinedMemebers] = useState();
  const { roomUsers } = useSocket();

  return (
    <div className="flex justify-around mt-10 w-full">
      {/* <pre className="text-white">{JSON.stringify(roomUsers)}</pre> */}

      {roomUsers.map((user) => {
        return (
          <div className="flex gap-3 items-center justify-between  rounded-2xl bg-white/3 p-3">
            <div className="">
              <img
                src={user.picture as string}
                className="size-10 rounded-full"
              />
            </div>
            <div className="text-white">
              <h1 className="text-lg">{user.name}</h1>
              <p className="text-xs">{user.email}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ConnectedUsersList;
