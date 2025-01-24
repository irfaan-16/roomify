import Navbar from "./Navbar";
import Gradient from "/gradient.webp";

const Dashboard = () => {
  return (
    <section className="py-4 relative">
      <img
        src={Gradient}
        srcSet="gradient image"
        className="absolute -z-2 top-0"
      />
      <Navbar />
    </section>
  );
};

export default Dashboard;
