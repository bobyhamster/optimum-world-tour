export default function MenuButtons() {
  return (
    <div className="flex gap-5">

      <button
        className="
          h-14
          px-8
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
          h-14
          px-8
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