export default function MenuButtons() {
  return (
    <div className="flex gap-[clamp(12px,2vw,20px)] flex-wrap">

      <button
        className="
          h-[clamp(48px,5vh,56px)]
px-[clamp(22px,2vw,32px)]
          rounded-full
          border
          border-[#33363C]
          bg-[#33363C]/40
          text-[#FFFBFB]
          transition
          hover:border-[#51B1FE]
        "
      >
        WORLD MAP
      </button>

      <button
        className="
         h-[clamp(48px,5vh,56px)]
px-[clamp(22px,2vw,32px)]
          rounded-full
          border
          border-[#33363C]
          bg-[#33363C]/40
          text-[#FFFBFB]
          transition
          hover:border-[#51B1FE]
        "
      >
        LEADERBOARD
      </button>

    </div>
  );
}