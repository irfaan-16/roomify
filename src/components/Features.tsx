import FeatureCard from "../FeatureCard";

const features = [
	{
		direction: "right",
		title: "Your Personal AI \nStudy Assistant",
		desc: "Get instant help with tough concepts, quick summaries, and curated study tips. Powered by AI, our chatbot is here to make your learning smarter and faster.",
		image: "/ai.png",
	},
	{
		direction: "left",
		title: "Collaborative \nWhiteboard \nfor brainstorming",
		desc: "Visualize ideas, solve problems, and collaborate in real time with our interactive whiteboard. Perfect for group discussions, sketching concepts.",
		image: "/whiteboard.png",
	},
	{
		direction: "right",
		title: "Real-Time \nText Editor",
		desc: "Get instant help with tough concepts, quick summaries, and curated study tips. Powered by AI, our chatbot is here to make your learning smarter and faster.",
		image: "/editor.png",
	},
	{
		direction: "left",
		title: "Study Smarter with \nInstant Messaging",
		desc: "Get instant help with tough concepts, quick summaries, and curated study tips. Powered by AI, our chatbot is here to make your learning smarter and faster.",
		image: "/messaging.png",
	},
];

const Features = () => {
	return (
		<div className="px-20 flex flex-col gap-8 items-center py-10">
			{features.map((feature, idx) => {
				return (
					<FeatureCard
						key={idx}
						direction={feature.direction}
						title={feature.title}
						desc={feature.desc}
						image={feature.image}
					/>
				);
			})}
		</div>
	);
};

export default Features;
