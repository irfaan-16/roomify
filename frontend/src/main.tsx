import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SocketProvider } from "./components/SocketContext.tsx";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./components/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import SocketListener from "./components/SocketListener.tsx";
import { RoomProvider } from "./components/RoomContext.tsx";
// import { RoomProvider } from "./components/RoomContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <AuthProvider>
        <RoomProvider>
          <Toaster
            toastOptions={{
              style: {
                backgroundColor: "black",
                color: "white",
                fontWeight: "bold",
              },
            }}
          />
          <BrowserRouter>
            <App />
            <SocketListener /> {/* Always active */}
          </BrowserRouter>
        </RoomProvider>
      </AuthProvider>
    </SocketProvider>
  </StrictMode>
);
