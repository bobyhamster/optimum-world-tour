import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import CloseButton from "./CloseButton";

export default function LeaderboardModal({ onClose }) {
  function formatGameTime(seconds) {
    if (seconds === null || seconds === undefined) {
      return "--:--";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  
useEffect(() => {
  loadLeaderboard();

  const channel = supabase
    .channel("leaderboard")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "profiles",
      },
      () => {
        loadLeaderboard();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

async function loadLeaderboard() {
  const { data, error } = await supabase
  .from("leaderboard")
  .select("*")
  .order("points", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setPlayers(data);
  const {
  data: { session },
} = await supabase.auth.getSession();

if (session) {
  const currentPlayer = data.find(
    (p) => p.id === session.user.id
  );

  setMe(currentPlayer);
}

setLoading(false);
  setLoading(false);
}

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-full
          max-w-[640px]
          rounded-[32px]
          bg-[#282C34]
          border
          border-[#3A414A]
          shadow-[0_30px_80px_rgba(0,0,0,0.5)]
          text-[#FFFBFB]
          font-sans
          box-border
        "
        style={{ padding: "36px 40px" }} /* Жорсткий відступ від країв модалки */
      >
        {/* Header Section */}
        <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
          <h1 
            className="text-[#FFFBFB] font-bold tracking-[-0.03em] leading-none"
            style={{ fontSize: "36px" }}
          >
            Leaderboard
          </h1>

          <CloseButton onClick={onClose} />
        </div>

        {/* Separator */}
        <div className="border-b border-[#3A414A]" style={{ marginBottom: "16px" }} />

        {/* Top 10 Players List */}
        <div 
          className="max-h-[320px] overflow-y-auto space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#3A414A] [&::-webkit-scrollbar-thumb]:rounded-full"
          style={{ paddingRight: "12px" }}
        >
          {players.map((player, index) => (
            <div
              key={player.id}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                hover:bg-[#33363C]/60
                transition-all
              "
              style={{ padding: "10px 16px" }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span
                  className="font-semibold font-mono shrink-0"
                  style={{ color: player.color, fontSize: "18px", width: "28px" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[#FFFBFB] font-medium truncate" style={{ fontSize: "16px" }}>
                  {player.nickname}
                </span>
              </div>

              {/* Права колонка XP з безпечним внутрішнім відступом */}
              <div className="text-right shrink-0">
  <div>
    <span className="text-[#FFFBFB] font-semibold" style={{ fontSize: "16px" }}>
      {player.points.toLocaleString()}
    </span>
    <span
      className="text-[#9DB0C2] font-normal"
      style={{ fontSize: "13px", marginLeft: "6px" }}
    >
      Points
    </span>
  </div>

  <div
    className="text-[#9DB0C2] font-normal"
    style={{ fontSize: "12px", marginTop: "3px" }}
  >
    {formatGameTime(player.game_time)}
  </div>
</div>
            </div>
          ))}
        </div>

        {/* Active Player Status Card (YOU) */}
        <div style={{ marginTop: "20px" }}>
          <div
            className="
              rounded-[20px]
              bg-[#282C34]
              border
              border-[#51B1FE]
              flex
              items-center
              justify-between
              shadow-[0_4px_24px_rgba(81,177,254,0.12)]
            "
            style={{ padding: "14px 20px" }}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#51B1FE] shrink-0" />
              <div className="min-w-0">
                <div className="text-[#51B1FE] font-bold tracking-[0.12em] uppercase leading-none" style={{ fontSize: "11px" }}>
                  YOU
                </div>
                <div className="text-[#FFFBFB] font-medium truncate" style={{ fontSize: "16px", marginTop: "4px" }}>
                  {me?.nickname}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
  <div>
    <span className="text-[#51B1FE] font-bold" style={{ fontSize: "20px" }}>
      {me?.points?.toLocaleString()}
    </span>
    <span
      className="text-[#9DB0C2] font-normal"
      style={{ fontSize: "13px", marginLeft: "6px" }}
    >
      Points
    </span>
  </div>

  <div
    className="text-[#9DB0C2] font-normal"
    style={{ fontSize: "12px", marginTop: "3px" }}
  >
    {formatGameTime(me?.game_time)}
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}