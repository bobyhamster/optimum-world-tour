export default function BottomCards({ onOpenLeaderboard }) {
  
  return (
    <div
      className="
        absolute
        bottom-8
        left-1/2
        -translate-x-1/2

        flex
        gap-6

        z-50
      "
    >
      {/* Leaderboard */}
      <button
  onClick={onOpenLeaderboard}
        className="
          relative

          w-[420px]
          h-[120px]

          rounded-[28px]

          bg-[#FFFBFB]

          overflow-hidden

          shadow-[0_20px_60px_rgba(0,0,0,.18)]

          transition-all
          duration-300

          hover:-translate-y-1
          hover:shadow-[0_25px_70px_rgba(0,0,0,.22)]
        "
      >
        <div className="absolute inset-0 flex items-center justify-center px-10">

          <div className="text-center">
            <h3 className="text-[26px] font-bold tracking-[-0.03em] text-[#282C34]">
              LEADERBOARD
            </h3>

            <p className="mt-2 text-[15px] leading-6 text-[#6E7785]">
              Compete with top explorers
              <br />
              around the world.
            </p>
          </div>

        </div>
      </button>

      {/* Daily Challenge */}
      <button
        disabled
        className="
          relative

          w-[420px]
          h-[120px]

          rounded-[28px]

          bg-[#ECEFF3]

          overflow-hidden

          opacity-70
          cursor-not-allowed

          shadow-[0_20px_60px_rgba(0,0,0,.12)]
        "
      >
        <div className="absolute inset-0 flex items-center justify-center px-10">
          <div
  className="
    absolute
    top-3
    right-4

    px-3
    py-1

    rounded-full

    bg-[#282C34]

    text-white
    text-[9px]
    font-bold
    tracking-[0.12em]

    uppercase

    shadow-[0_4px_12px_rgba(0,0,0,.2)]
  "
>
  Coming Soon
</div>

          <div className="text-center">
            <h3 className="text-[26px] font-bold tracking-[-0.03em] text-[#282C34]">
              DAILY CHALLENGE
            </h3>

            <p className="mt-2 text-[15px] leading-6 text-[#6E7785]">
              Complete a new mission
              <br />
              every day.
            </p>
          </div>

          <div className="absolute right-8">
            <span className="text-[28px] opacity-60">
              🔒
            </span>
          </div>

        </div>
      </button>

    </div>
  );
}