import Navbar from "./Navbar";
import Gradient from "/gradient.webp";
import Inbox from "./Inbox";
import Editor from "./Editor";

const Dashboard = () => {
  return (
    <section className="py-4 relative  px-4 ">
      <img
        src={Gradient}
        srcSet="gradient image"
        className="absolute -z-2 top-0 pointer-events-none"
      />
      <Navbar />
      <div className="flex justify-between gap-6 mt-6">
        <div className="w-full">
          <div className="bg-white/4  p-2 text-white font-bold flex justify-center gap-3">
            <button className="py-2 px-4 rounded-md cursor-pointer min-w-36">
              whiteboard
            </button>
            <div className="w-0.5 h-10 bg-white/10"></div>
            <button className="py-2 px-4 bg-black/60 rounded-md cursor-pointer">
              text editor
            </button>
          </div>
          <Editor />
        </div>
        <Inbox />
      </div>
    </section>
  );
};

export default Dashboard;
