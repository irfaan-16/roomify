import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SocketProvider } from "./components/SocketContext.tsx";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./components/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </SocketProvider>
  </StrictMode>
);
