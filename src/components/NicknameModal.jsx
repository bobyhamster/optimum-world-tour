import { useState } from "react";

export default function NicknameModal({ onSubmit }) {
  const [nickname, setNickname] = useState("");

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xl">
      <div className="w-[520px] rounded-[32px] border border-[#3B414B] bg-[#2C3138]/95 p-10 shadow-[0_30px_100px_rgba(0,0,0,.55)]">

        <p className="text-[#51B1FE] text-sm font-semibold tracking-[0.25em] uppercase">
          Welcome
        </p>

        <h1 className="mt-3 text-[36px] font-bold text-white">
          Choose your explorer name
        </h1>

        <p className="mt-3 text-[#B0BED1]">
          This nickname will appear on the leaderboard and during multiplayer matches.
        </p>

        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          placeholder="BobyHamster"
          className="mt-8 w-full h-[62px] rounded-2xl bg-[#1F242B] border border-[#3B414B] px-6 text-white text-xl outline-none focus:border-[#51B1FE]"
        />

        <button
          disabled={nickname.trim().length < 3}
          onClick={() => onSubmit(nickname)}
          className="mt-8 w-full h-[62px] rounded-full bg-white text-[#282C34] text-lg font-bold transition hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          CONTINUE
        </button>

      </div>
    </div>
  );
}