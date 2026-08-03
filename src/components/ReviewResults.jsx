import MiniMap from "./MiniMap";
import LeaderboardModal from "./LeaderboardModal";
import { useState } from "react";   

export default function ReviewResults({
  score = 0,
  results = [],
  totalTime = 24,
  onPlayAgain,
  onLeaderboard,
  onExit,
}) {
  const bestRound = Math.max(...results.map((r) => r.score || 0), 0);

  const totalDistance = Math.round(
    results.reduce((sum, r) => sum + (r.distance || 0), 0)
  );
  const totalScore = results.reduce(
  (sum, r) => sum + (r.score || 0),
  0
);
const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <main className="relative h-screen overflow-hidden bg-[#282C34]">
      {/* MAP */}
      <MiniMap reviewMode={true} resultMode={true} results={results} />

      {/* Bottom Floating Panel */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[9999]">
        <div
          className="
            w-[1140px]
            h-[150px]
            rounded-[34px]
            bg-gradient-to-b
            from-[#FFFBFB]
            to-[#D3DBE2]
            border
            border-white/70
            shadow-[0_18px_50px_rgba(0,0,0,.18)]
            flex
            items-center
            px-8
          "
        >
          <div className="flex items-center w-full justify-between">
            
            {/* LEFT: BEST ROUND */}
            <div className="w-[240px] flex justify-center">
              <div className="flex flex-col items-start text-left">
                <p className="text-[13px] uppercase tracking-[2px] text-[#9DB0C2] font-semibold">
                  BEST ROUND
                </p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-[52px] font-black leading-none text-[#282C34]">
                    {bestRound.toLocaleString()}
                  </span>
                  <span className="text-[20px] font-bold text-[#9DB0C2]">
                    pts
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-20 bg-[#CCD5DF]" />

            {/* MIDDLE: BUTTONS */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLeaderboard(true)}
                className="
                  w-[200px]
                  h-[72px]
                  rounded-full
                  bg-gradient-to-b
                  from-[#8CB5D8]
                  to-[#6E98BD]
                  text-white
                  text-[18px]
                  font-black
                  tracking-[2px]
                  shadow-[0_10px_24px_rgba(110,152,189,.3)]
                  transition-all
                  hover:scale-[1.03]
                  hover:brightness-105
                  active:scale-[0.98]
                "
              >
                LEADERBOARD
              </button>

              <button
                onClick={onPlayAgain}
                className="
                  w-[210px]
                  h-[80px]
                  rounded-full
                  bg-gradient-to-b
                  from-[#8CB5D8]
                  to-[#6E98BD]
                  text-white
                  text-[21px]
                  font-black
                  tracking-[2px]
                  shadow-[0_12px_28px_rgba(110,152,189,.4)]
                  transition-all
                  hover:scale-[1.04]
                  hover:brightness-105
                  active:scale-[0.97]
                "
              >
                PLAY AGAIN
              </button>

              <button
                onClick={onExit}
                className="
                  w-[160px]
                  h-[72px]
                  rounded-full
                  bg-gradient-to-b
                  from-[#8CB5D8]
                  to-[#6E98BD]
                  text-white
                  text-[18px]
                  font-black
                  tracking-[2px]
                  shadow-[0_10px_24px_rgba(110,152,189,.3)]
                  transition-all
                  hover:scale-[1.03]
                  hover:brightness-105
                  active:scale-[0.98]
                "
              >
                EXIT
              </button>
            </div>

            {/* Divider */}
            <div className="w-px h-20 bg-[#CCD5DF]" />

            {/* RIGHT: OF 25,000 POINTS */}
            <div className="w-[240px] flex justify-center">
              <div className="flex flex-col items-center text-center">
                <p className="text-[13px] uppercase tracking-[2px] text-[#9DB0C2] font-semibold">
                  OF 25,000 POINTS
                </p>
                <div className="flex items-end justify-center gap-2 mt-1">
  <span className="text-[48px] font-black leading-none text-[#282C34]">
    {totalScore.toLocaleString()}
  </span>

  <span className="text-[20px] mb-1 font-bold text-[#9DB0C2]">
    pts
  </span>
</div>
                <div className="text-[14px] font-bold text-[#8E99A9] tracking-wider mt-1">
                  {totalDistance.toLocaleString()} km / {totalTime} sec
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {showLeaderboard && (
  <LeaderboardModal
    onClose={() => setShowLeaderboard(false)}
  />
)}
    </main>
  );
}