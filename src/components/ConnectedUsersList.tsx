import avatar from "/avatar.jpg";
const ConnectedUsersList = () => {
	return (
		<div className="flex justify-around mt-9">
			<div className="flex items-center justify-between w-52 rounded-2xl bg-white/3 p-3">
				<div className="">
					<img src={avatar} className="size-10 rounded-full" />
				</div>
				<div className="text-white">
					<h1 className="text-lg">John Doe</h1>
					<p className="text-xs">johndoe@gmail.com</p>
				</div>
			</div>

			<div className="flex items-center justify-between w-52 rounded-2xl bg-white/3 p-3">
				<div className="">
					<img src={avatar} className="size-10 rounded-full" />
				</div>
				<div className="text-white">
					<h1 className="text-lg">John Doe</h1>
					<p className="text-xs">johndoe@gmail.com</p>
				</div>
			</div>

			<div className="flex items-center justify-between w-52 rounded-2xl bg-white/3 p-3">
				<div className="">
					<img src={avatar} className="size-10 rounded-full" />
				</div>
				<div className="text-white">
					<h1 className="text-lg">John Doe</h1>
					<p className="text-xs">johndoe@gmail.com</p>
				</div>
			</div>

			<div className="flex items-center justify-between w-52 rounded-2xl bg-white/3 p-3">
				<div className="">
					<img src={avatar} className="size-10 rounded-full" />
				</div>
				<div className="text-white">
					<h1 className="text-lg">John Doe</h1>
					<p className="text-xs">johndoe@gmail.com</p>
				</div>
			</div>

			<div className="flex items-center justify-between w-52 rounded-2xl bg-white/3 p-3">
				<div className="">
					<img src={avatar} className="size-10 rounded-full" />
				</div>
				<div className="text-white">
					<h1 className="text-lg">John Doe</h1>
					<p className="text-xs">johndoe@gmail.com</p>
				</div>
			</div>
		</div>
	);
};
export default ConnectedUsersList;
