import Message from "./Message";
// import { Send } from "lucide-react";

const Inbox = () => {
  return (
    <div className="rounded-xl bg-white/2 max-w-96  p-4">
      <div className="bg-white/4 rounded-md p-2 text-white font-bold flex justify-center gap-3">
        <button className="py-2 px-4 rounded-md cursor-pointer min-w-36">
          Ask the AI
        </button>
        <div className="w-0.5 h-10 bg-white/10"></div>
        <button className="py-2 px-4 bg-black/60 rounded-md cursor-pointer">
          Chat with Others
        </button>
      </div>

      {/* messsages */}
      <div className="flex flex-col gap-2 mt-4 max-h-96 overflow-y-auto px-3 ">
        <Message
          message="Hiii how are you?!"
          avatar="/avatar.jpg"
          isSender={true}
        />

        <Message
          message="Hiii how are you?!"
          avatar="/avatar.jpg"
          isSender={false}
        />
        <Message
          message="Hiii how are you?!"
          avatar="/avatar.jpg"
          isSender={false}
        />
        <Message
          message="Hiii how are you?!"
          avatar="/avatar.jpg"
          isSender={false}
        />
        <Message
          message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit nemo excepturi error minima, omnis adipisci officiis autem porro aliquam quo laborum amet saepe ipsum a eum pariatur, et quas explicabo!"
          avatar="/avatar.jpg"
          isSender={true}
        />
        <Message
          message="Hiii how are you?!"
          avatar="/avatar.jpg"
          isSender={true}
        />

        <Message
          message="Badhiya bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={false}
        />

        <Message
          message="BadhiyaBadhiya bhai tu suuna Badhiya bhai tu suuna Badhiya bhai tu suunaBadhiya bhai tu suuna bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={false}
        />

        <Message
          message="Badhiya bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={true}
        />
        <Message
          message="BadhiyaBadhiya bhai tu suuna Badhiya bhai tu suuna Badhiya bhai tu bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={true}
        />

        <Message
          message="Badhiya Badhiya bhai tu suuna Badhiya bhai tu suunaBadhiya bhai tu suunaBadhiya bhai tu suuna tu suuna!"
          avatar="/avatar.jpg"
          isSender={false}
        />

        <Message
          message="Badhiya bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={true}
        />
        <Message
          message="BadhiBadhiya bhai tu suuna Badhiya bhai tu suunaBadhiya bhai tu suunaBadhiya bhai tu suuna u suuna!"
          avatar="/avatar.jpg"
          isSender={true}
        />
        <Message
          message="Badhiya bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={false}
        />

        <Message
          message="Badhiya bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={false}
        />

        <Message
          message="BadhiyaBadhi ya bhai tu suunaBadh iya bhai tu suuna Badhiya bha i tu suunaBadhiy a bhai tu suunava!"
          avatar="/avatar.jpg"
          isSender={true}
        />
        <Message
          message="Badhiya bhaBadhiya bhai tu suunaBadhiya bhai tu suunaBadhiya bhai tu suunaBadhiya bhai tu suunai tu suuna!"
          avatar="/avatar.jpg"
          isSender={true}
        />
        <Message
          message="Badhiya bhai  Badhiya bhai tu suunaBadhiya bhai tu suunaBadhiya bhai tu suunavtu suuna!"
          avatar="/avatar.jpg"
          isSender={false}
        />

        <Message
          message="Badhiya bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={false}
        />

        <Message
          message="Badhiya bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={false}
        />

        <Message
          message="Badhiya bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={true}
        />
        <Message
          message="Badhiya bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={false}
        />

        <Message
          message="Badhiya bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={false}
        />

        <Message
          message="Badhiya bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={false}
        />

        <Message
          message="Badhiya bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={true}
        />
        <Message
          message="Badhiya bhai tu suuna!"
          avatar="/avatar.jpg"
          isSender={false}
        />
      </div>

      <div className="pt-2 flex items-center bg-white/3 p-2 rounded-md mt-3 gap-2">
        <input
          type="text"
          placeholder="write your message..."
          className="bg-white/5 border-none outline-none text-white rounded-full px-3 py-1 text-md w-full"
        />
        <div className="py-1 px-2 rounded-sm  cursor-pointer bg-white/2">
          {/* <Send size={20} color="#fff" /> */}
          <p className="font-bold text-purple-600">send</p>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
