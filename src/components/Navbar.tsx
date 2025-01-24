import { LogIn } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex items-center max-w-64 justify-between m-auto bg-black/20 text-white py-2 px-4 rounded-2xl shadow-2xl shadow-white/3 md:max-w-96 lg:max-w-xl">
      <h3 className="font-bold cursor-pointer">roomify</h3>

      <button className="flex items-center gap-2 w-24 bg-purple-700 rounded-md p-2 text-white font-bold cursor-pointer px-3 py-[5px]">
        <LogIn size={20} />
        login
      </button>
    </div>
  );
};

export default Navbar;
