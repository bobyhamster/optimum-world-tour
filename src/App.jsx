import { useState } from "react";

import Home from "./pages/Home";
import Game from "./pages/Game";

export default function App() {
  const [screen, setScreen] = useState("home");

  return (
    <>
      {screen === "home" && (
        <Home onStart={() => setScreen("game")} />
      )}

      {screen === "game" && (
  <Game onExit={() => setScreen("home")} />
)}
    </>
  );
}