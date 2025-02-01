interface PageProps {
  message: string;
  avatar: string;
  isSender: boolean;
}

const Message = ({ message, avatar, isSender }: PageProps) => {
  return (
    <div className="flex items-start gap-2 mb-2">
      {!isSender && (
        <img src={avatar} alt="user avatar" className="h-7 rounded-full" />
      )}

      <div
        className={`${
          !isSender
            ? "border-1 border-purple-700 rounded-tl-none"
            : "rounded-tr-none bg-gradient-to-l  to-purple-600 ml-auto"
        } rounded-2xl text-white text-xs flex items-center py-2 px-4 `}
      >
        <p>{message}</p>
      </div>
      {isSender && (
        <img src={avatar} alt="user avatar" className="h-7 rounded-full" />
      )}
    </div>
  );
};

export default Message;
