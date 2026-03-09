import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Header } from "./components/Header.jsx";
import { Simulation } from "./routes/Simulation.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Header />
    <Simulation />
  </StrictMode>,
);
