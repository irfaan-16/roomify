// import Dashboard from "./components/Dashboard";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import WaitingScreen from "./components/WaitingScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/waiting/:roomId" element={<WaitingScreen />} />
      <Route path="/room/:roomId" element={<Dashboard />} />
    </Routes>
  );
  // return
}

export default App;
