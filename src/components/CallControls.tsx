import end from "/end.png";
import mic from "/mic.png";
import capture from "/capture.png"
const CallControls = () => {
	return (
		<div className="flex w-full justify-evenly">
			<div className="flex items-center gap-2 font-bold text-lg text-white w-fit bg-white/3 py-1 pl-1 pr-4 rounded-full cursor-pointer">
				<div className="bg-black  rounded-full p-1">
					<img src={mic} className="size-9" />
				</div>
				<p>mic</p>
			</div>
			<div className="flex items-center gap-2 font-bold text-lg text-white w-fit bg-white/3 py-1 pl-1 pr-4 rounded-full cursor-pointer">
				<div className="bg-black  rounded-full p-1">
					<img src={capture} className="size-9" />
				</div>
				<p>capture</p>
			</div>
			<div className="flex items-center gap-2 font-bold text-lg text-white w-fit bg-white/3 py-1 pl-1 pr-4 rounded-full cursor-pointer">
				<div className="bg-black  rounded-full p-1">
					<img src={end} className="size-9" />
				</div>
				<p>end</p>
			</div>
		</div>
	);
};

export default CallControls;
