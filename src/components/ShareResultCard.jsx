import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { supabase } from "../lib/supabase";

import logo from "../assets/logo.png";
import shareMapBronze from "../assets/share-map-bronze.png";
import shareMapSilver from "../assets/share-map-silver.png";
import shareMapGold from "../assets/share-map-gold.png";
import shareMapDiamond from "../assets/share-map-diamond.png";

function getCardRarityConfig(score) {
  if (score >= 20000) {
    return {
      tier: "PLATINUM",
      bgImage: shareMapDiamond,
      borderColor: "border-[#EEFFFF]",
      glowEffect: "shadow-[0_0_35px_rgba(238,255,255,0.45)]",
      badgeStyle: "bg-[#EEFFFF]/15 text-[#EEFFFF] border-[#EEFFFF]/40",
    };
  }
  if (score >= 12000) {
    return {
      tier: "GOLD",
      bgImage: shareMapGold,
      borderColor: "border-[#FFE342]",
      glowEffect: "shadow-[0_0_35px_rgba(255,227,66,0.4)]",
      badgeStyle: "bg-[#FFE342]/15 text-[#FFE342] border-[#FFE342]/40",
    };
  }
  if (score >= 5000) {
    return {
      tier: "SILVER",
      bgImage: shareMapSilver,
      borderColor: "border-[#D8D8D8]",
      glowEffect: "shadow-[0_0_30px_rgba(216,216,216,0.35)]",
      badgeStyle: "bg-[#D8D8D8]/15 text-[#D8D8D8] border-[#D8D8D8]/40",
    };
  }
  return {
    tier: "BRONZE",
    bgImage: shareMapBronze,
    borderColor: "border-[#E5C399]",
    glowEffect: "shadow-[0_0_25px_rgba(229,195,153,0.35)]",
    badgeStyle: "bg-[#E5C399]/15 text-[#E5C399] border-[#E5C399]/40",
  };
}

function formatTime(seconds) {
  if (!seconds || seconds <= 0) return "0s";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

// Хелпер для перетворення DataURL у Blob
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export default function ShareResultCard({
  nickname = "Player",
  score = 0,
  results = [],
  leaderboard = [],
  globalRank,
  timeInSeconds,
  time,
  onClose,
}) {
  const cardRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const [supabaseStats, setSupabaseStats] = useState({
    bestScore: 0,
    averageScore: 0,
    gameTime: 0,
    globalRank: null,
  });

  const rarity = getCardRarityConfig(supabaseStats.bestScore);

  useEffect(() => {
    async function loadStats() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Failed to get user:", userError);
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("points, game_time")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Failed to load profile:", profileError);
        }

        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from("leaderboard")
          .select("id, points, game_time")
          .order("points", { ascending: false })
          .order("game_time", { ascending: true });

        if (leaderboardError) {
          console.error("Failed to load leaderboard:", leaderboardError);
        }

        const bestScore = Number(profile?.points || 0);
        const averageScore = Math.round(bestScore / 5);
        const gameTime = Number(profile?.game_time || 0);

        let calculatedRank = null;
        if (leaderboardData) {
          const playerIndex = leaderboardData.findIndex(
            (player) => player.id === user.id
          );
          if (playerIndex !== -1) {
            calculatedRank = playerIndex + 1;
          }
        }

        setSupabaseStats({
          bestScore,
          averageScore,
          gameTime,
          globalRank: calculatedRank,
        });
      } catch (error) {
        console.error("Failed to load Supabase stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  // 1. Копіювання зображення в буфер обміну (без alert)
  async function copyCard() {
    if (busy || loading) return;
    setBusy(true);

    try {
      if (!cardRef.current) return;

      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 1.5,
        cacheBust: false,
        backgroundColor: "#050608",
      });

      const blob = dataURLtoBlob(dataUrl);
      const item = new ClipboardItem({ "image/png": blob });

      await navigator.clipboard.write([item]);
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Failed to copy image.");
    } finally {
      setBusy(false);
    }
  }

  // 2. Редирект у X (Twitter) з англійським текстом без емодзі та з відступом
  function shareCard() {
    const formattedTimeStr = formatTime(supabaseStats.gameTime);
    const shareText = `Scored ${supabaseStats.bestScore.toLocaleString()} points in ${formattedTimeStr} playing Optimum World Tour!\n\nThanks for the game @bobyhamster and @0xTynar`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

    window.open(twitterShareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 flex flex-col items-center my-auto py-10">
        {loading ? (
          <div className="w-[880px] max-w-[95vw] aspect-[1.8/1] bg-[#050608] border-2 border-white/10 flex items-center justify-center">
            <span className="text-white/60 font-black tracking-widest uppercase animate-pulse text-lg">
              LOADING CARD...
            </span>
          </div>
        ) : (
          /* === MAIN CARD CONTAINER === */
          <div
            ref={cardRef}
            className={`
              relative
              w-[880px] max-w-[95vw]
              aspect-[1.8/1]
              bg-[#050608]
              border-2 ${rarity.borderColor}
              ${rarity.glowEffect}
              p-6 md:p-8
              overflow-hidden
              text-white
              font-sans
              select-none
              transition-all duration-300
            `}
          >
            <img
              src={rarity.bgImage}
              alt={`${rarity.tier} World Map Background`}
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
            />

            {/* === LOGO + TEXT (TOP LEFT) === */}
            <div className="absolute top-11 left-12 md:left-16 z-10 flex items-start gap-1 font-black uppercase tracking-tighter leading-none select-none">
              <img
                src={logo}
                alt="Optimum"
                className="
                  h-[1.60em]
                  w-auto
                  object-contain
                  pointer-events-none
                  translate-y-[0.40em]
                  shrink-0
                "
              />

              <div className="relative flex flex-col items-center shrink-0">
                <span className="text-3xl md:text-4xl font-black leading-none text-white">
                  PTIMUM
                </span>

                <div className="absolute top-full left-1/2 -translate-x-[60%] mt-1">
                  <span className="text-3xl md:text-4xl font-black leading-none text-white whitespace-nowrap">
                    WORLD TOUR
                  </span>
                </div>
              </div>
            </div>

            {/* === PLAYER & SCORE BLOCK === */}
            <div className="absolute top-[50%] left-[19%] -translate-x-1/2 -translate-y-1/2 z-10 w-[300px] max-w-full flex flex-col items-center">
              <div className="flex items-center justify-center gap-3 w-full mb-3">
                <div className="flex-1 border-t border-white/20" />
                <span className="text-xs font-bold tracking-[0.3em] text-white/70 uppercase shrink-0">
                  PLAYER
                </span>
                <div className="flex-1 border-t border-white/20" />
              </div>

              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white text-center mb-6 py-1 leading-normal">
                {nickname}
              </h2>

              <div className="flex items-center justify-center gap-3 w-full mb-3">
                <div className="flex-1 border-t border-white/20" />
                <span className="text-xs font-bold tracking-[0.3em] text-white/70 uppercase shrink-0">
                  TOTAL SCORE
                </span>
                <div className="flex-1 border-t border-white/20" />
              </div>

              <div className="pt-3 flex flex-col items-center">
                <div className="text-6xl md:text-7xl font-black tracking-tight text-white text-center leading-none">
                  {supabaseStats.bestScore.toLocaleString()}
                </div>

                <span className="text-xs font-black tracking-[0.4em] text-white/60 text-center mt-4 uppercase">
                  POINTS
                </span>
              </div>
            </div>

            {/* === STATS BLOCK (AVG SCORE | TIME | GLOBAL RANK) === */}
            <div className="absolute bottom-10 left-6 right-6 z-10">
              <div className="grid grid-cols-3 gap-3 w-full">
                {/* 1. AVG SCORE */}
                <div className="bg-gradient-to-b from-[#FFFFFF] via-[#F0F4F8] to-[#CDD7E1] px-4 py-3 flex items-center justify-around text-black shadow-xl">
                  <div className="shrink-0 flex items-end gap-1 h-7">
                    <div className="w-2 bg-black h-4" />
                    <div className="w-2 bg-black h-7" />
                    <div className="w-2 bg-black h-2.5" />
                  </div>
                  <div className="w-[1.5px] h-8 bg-black/20 shrink-0" />
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl font-black tracking-tight leading-none text-black">
                      {supabaseStats.averageScore.toLocaleString()}
                    </span>
                    <span className="text-[8px] font-black tracking-[0.15em] text-black/70 uppercase mt-1">
                      AVG SCORE
                    </span>
                  </div>
                </div>

                {/* 2. TIME */}
                <div className="bg-gradient-to-b from-[#FFFFFF] via-[#F0F4F8] to-[#CDD7E1] px-4 py-3 flex items-center justify-around text-black shadow-xl">
                  <div className="shrink-0">
                    <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 20c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59-8 8 3.59 8 8 8zm0-18c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm.5 5h-1.5v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                    </svg>
                  </div>
                  <div className="w-[1.5px] h-8 bg-black/20 shrink-0" />
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl font-black tracking-tight leading-none text-black">
                      {formatTime(supabaseStats.gameTime)}
                    </span>
                    <span className="text-[8px] font-black tracking-[0.15em] text-black/70 uppercase mt-1">
                      TIME
                    </span>
                  </div>
                </div>

                {/* 3. GLOBAL RANK */}
                <div className="bg-gradient-to-b from-[#FFFFFF] via-[#F0F4F8] to-[#CDD7E1] px-4 py-3 flex items-center justify-around text-black shadow-xl">
                  <div className="shrink-0">
                    <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H8v2h8v-2h-3v-2.1c2.12-.39 3.79-2.12 3.96-4.35C19.39 11.23 21 9.12 21 6.5V5c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                    </svg>
                  </div>
                  <div className="w-[1.5px] h-8 bg-black/20 shrink-0" />
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl font-black tracking-tight leading-none text-black">
                      {supabaseStats.globalRank
                        ? `#${supabaseStats.globalRank}`
                        : "—"}
                    </span>
                    <span className="text-[8px] font-black tracking-[0.15em] text-black/70 uppercase mt-1">
                      GLOBAL RANK
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* === ACTION BUTTONS === */}
        <div className="mt-12 flex items-center justify-center gap-6 relative z-50 translate-y-12 md:translate-y-5">
          <button
            onClick={copyCard}
            disabled={busy || loading}
            className="
              h-16 px-12 rounded-full
              bg-gradient-to-b from-[#8CAFCF] via-[#7B9EBF] to-[#6A93BD]
              text-white font-black text-lg tracking-wider uppercase
              shadow-[0_10px_25px_rgba(106,147,189,0.4)]
              hover:brightness-105 hover:scale-105 active:scale-95
              transition-all duration-200 ease-out
              cursor-pointer
              disabled:opacity-50
            "
          >
            {busy ? "COPYING..." : "COPY"}
          </button>

          <button
            onClick={shareCard}
            disabled={loading}
            className="
              h-16 px-12 rounded-full
              bg-gradient-to-b from-[#8CAFCF] via-[#7B9EBF] to-[#6A93BD]
              text-white font-black text-lg tracking-wider uppercase
              shadow-[0_10px_25px_rgba(106,147,189,0.4)]
              hover:brightness-105 hover:scale-105 active:scale-95
              transition-all duration-200 ease-out
              cursor-pointer
              disabled:opacity-50
            "
          >
            SHARE
          </button>

          <button
            onClick={onClose}
            className="
              h-16 px-12 rounded-full
              bg-gradient-to-b from-[#4A5568] to-[#2D3748]
              text-white/90 font-black text-lg tracking-wider uppercase
              shadow-[0_10px_25px_rgba(0,0,0,0.5)]
              hover:brightness-110 hover:scale-105 active:scale-95
              transition-all duration-200 ease-out cursor-pointer
            "
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}