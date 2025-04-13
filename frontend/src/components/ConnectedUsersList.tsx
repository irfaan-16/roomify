import { useRoom } from "./RoomContext";

const ConnectedUsersList = () => {
  const { roomInfo } = useRoom();
  return (
    <div>
      <h2 className="text-white font-bold text-2xl bg-purple-800 rounded-sm py-2 px-4 w-fit">
        Participants
      </h2>
      <div className="flex justify-around mt-10 w-full">
        {roomInfo?.participants.length === 0 ? (
          <h1 className="text-white text-2xl">No one's around!</h1>
        ) : (
          roomInfo?.participants.map((user) => {
            return (
              <div
                className="flex gap-3 items-center justify-between  rounded-2xl bg-white/3 p-3"
                key={user.email}
              >
                <div>
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
          })
        )}
      </div>
    </div>
  );
};
export default ConnectedUsersList;
