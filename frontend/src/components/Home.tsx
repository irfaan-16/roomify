import Gradient from "/gradient.webp";
import Navbar from "./Navbar";
import { CirclePlus, LogIn } from "lucide-react";

function Home() {
  return (
    <div className="py-4 relative ">
      <img
        src={Gradient}
        alt="gradient image"
        className="absolute -z-2 top-0"
      />
      <Navbar />

      <section className="mt-12 md:min-h-[calc(100vh-300px)] md:flex md:items-center md:justify-center">
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
            <button className="text-white flex gap-2 bg-gradient-to-b from-white/2 to-white/5  shadow-xl shadow-white/2 py-2 px-4 rounded-md font-bold min-w-40 justify-center cursor-pointer">
              <CirclePlus color="#d00bea" />
              create room
            </button>

            <button className="text-white flex gap-2 bg-gradient-to-b from-white/2 to-white/5  shadow-xl shadow-white/2 py-2 px-4 rounded-md font-bold min-w-40 justify-center cursor-pointer">
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
