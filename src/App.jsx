import { useState } from "react";

import Home from "./pages/Home";
import Game from "./pages/Game";

// 🔴 Set to "true" to enable maintenance mode
// 🟢 Set to "false" to make the site fully accessible
const IS_MAINTENANCE = false;

function MaintenanceScreen() {
  return (
    <div className="min-h-screen bg-[#282C34] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="w-16 h-16 mb-6 rounded-2xl bg-[#51B1FE]/10 border border-[#51B1FE]/30 flex items-center justify-center text-[#51B1FE]">
        <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>

      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
        TECHNICAL WORKS
      </h1>
      
      <p className="text-[#8E99A9] text-sm md:text-base max-w-md leading-relaxed">
        The website is currently undergoing scheduled maintenance. Please check back soon!
      </p>

      <div className="mt-8 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/40 font-mono">
        Status: Maintenance Mode
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");

  // Якщо увімкнено режим технічних робіт, показуємо заглушку
  if (IS_MAINTENANCE) {
    return <MaintenanceScreen />;
  }

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