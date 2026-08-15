import MiniMap from "./MiniMap";
import LeaderboardModal from "./LeaderboardModal";
import ShareResultCard from "./ShareResultCard";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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
  const [showShareCard, setShowShareCard] = useState(false);
  const [nickname, setNickname] = useState("PLAYER");

  useEffect(() => {
    async function loadNickname() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Failed to load nickname:", error);
        return;
      }

      if (data?.nickname) {
        setNickname(data.nickname);
      }
    }

    loadNickname();
  }, []);

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
            <div className="w-[220px] flex justify-center shrink-0">
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
            <div className="w-px h-20 bg-[#CCD5DF] shrink-0" />

            {/* MIDDLE: BUTTONS */}
            <div className="flex items-center gap-3 shrink-0">

              <button
                onClick={() => setShowLeaderboard(true)}
                className="
                  w-[190px]
                  h-[72px]
                  rounded-full
                  bg-gradient-to-b
                  from-[#8CB5D8]
                  to-[#6E98BD]
                  text-white
                  text-[17px]
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
                  w-[200px]
                  h-[80px]
                  rounded-full
                  bg-gradient-to-b
                  from-[#8CB5D8]
                  to-[#6E98BD]
                  text-white
                  text-[20px]
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
                  w-[150px]
                  h-[72px]
                  rounded-full
                  bg-gradient-to-b
                  from-[#8CB5D8]
                  to-[#6E98BD]
                  text-white
                  text-[17px]
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

            {/* SHARE CARD BUTTON — the red-square position */}
            <button
                onClick={() => setShowShareCard(true)}
                aria-label="Generate share card"
                title="Generate share card"
                className="
                  ml-3
                  w-[88px]
                  h-[72px]
                  shrink-0
                  rounded-[20px]
                  bg-gradient-to-b
                  from-[#8CB5D8]
                  to-[#6E98BD]
                  border
                  border-white/30
                  text-white
                  shadow-[0_10px_24px_rgba(110,152,189,.3)]
                  flex
                  items-center
                  justify-center
                  transition-all
                  hover:scale-[1.06]
                  hover:brightness-105
                  active:scale-[0.96]
                "
              >
                <span className="text-[16px] font-black tracking-[2px]">
                  CARD
                </span>
              </button>

            {/* Divider */}
            <div className="w-px h-20 bg-[#CCD5DF] ml-3 shrink-0" />

            {/* RIGHT: OF 25,000 POINTS */}
            <div className="w-[220px] flex justify-center shrink-0">
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

      {showShareCard && (
        <ShareResultCard
          nickname={nickname}
          score={totalScore}
          results={results}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </main>
  );
}