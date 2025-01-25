import { Check, PencilLine } from "lucide-react";
const TasksList = () => {
	return (
		<div className="text-white bg-black/50 w-fit p-4 rounded-xl max-w-96">
			<h1 className="text-3xl font-bold mb-6">Tasks List</h1>
			<div className="flex items-end gap-3">
				<div>
					<div className="flex gap-3 items-center p-2 mb-2 bg-white/5 rounded-md max-w-fit pr-4">
						<Check size={22} />
						<p>team discussion</p>
					</div>
					<div className="flex gap-3 items-center p-2 mb-2 bg-white/5 rounded-md max-w-fit pr-4">
						<Check size={22} />
						<p>weekly report meeting review</p>
					</div>
					<div className="flex gap-3 items-start p-2 mb-2 bg-white/5 rounded-md pr-4 ">
						<Check size={22} className="min-w-fit" />
						<p>
							design sy em feedback repo em feedback repo em feedback repoem
							feedback reports des
						</p>
					</div>
				</div>

				<div className="w-fit ml-auto bg-white/5 rounded-full p-3 cursor-pointer">
					<PencilLine />
				</div>
			</div>
		</div>
	);
};

export default TasksList;
