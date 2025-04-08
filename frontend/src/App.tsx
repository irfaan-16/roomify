// import Dashboard from "./components/Dashboard";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import WaitingScreen from "./components/WaitingScreen";
import DataPreview from "./components/DataPreview";
// import { useRoom } from "./components/RoomContext";

function App() {
  // const { roomId, roomInfo } = useRoom();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/waiting/:roomId" element={<WaitingScreen />} />
      <Route path="/room/:roomId" element={<Dashboard />} />
      <Route path="/data" element={<DataPreview />} />
    </Routes>
  );
  // return
}

export default App;
