interface PageProps {
	action: string;
	desc: string;
	link: string;
}

const RoomGenerationModale = ({ action, desc, link }: PageProps) => {
	return (
		<div className="bg-black w-xl text-white p-10 rounded-md m-10">
			<h1 className="text-4xl font-bold">{action} a room</h1>
			<p className="my-4 text-white/40">{desc}</p>
			<div className="h-12 pl-6 pr-2 bg-white/5 rounded-md flex justify-between items-center">
				<p className="font-bold ">{link}</p>
				<div className="bg-black p-1 w-20 rounded-md text-center cursor-pointer">
					<p className="text-lg -mt-1 font-bold">
						{action === "create" ? "copy" : "join"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default RoomGenerationModale;
