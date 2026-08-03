export default function FinalRoundPanel({
  animatedDistance,
  animatedPoints,
  onViewResults,
}) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]">
      <div
        className="
          w-[1120px]
          h-[150px]
          rounded-[34px]
          bg-gradient-to-b
          from-[#FFFBFB]
          to-[#DCE5EE]
          border
          border-white/70
          shadow-[0_18px_50px_rgba(0,0,0,.18)]
          flex
          items-center
          justify-center
        "
      >
        <div className="flex items-center gap-14">

          <div className="w-[240px] text-center">
            <p className="text-[13px] uppercase tracking-[2px] text-[#8E99A9] font-semibold">
              FROM LOCATION
            </p>

            <div className="flex justify-center items-end gap-2 mt-1">
              <span className="text-[56px] font-black text-[#282C34]">
                {animatedDistance.toLocaleString()}
              </span>

              <span className="text-[22px] mb-2 font-bold text-[#8E99A9]">
                km
              </span>
            </div>
          </div>

          <div className="w-px h-20 bg-[#CCD5DF]" />

          <button
            onClick={onViewResults}
            className="
              w-[320px]
              h-[82px]
              rounded-full
              bg-gradient-to-b
              from-[#51B1FE]
              to-[#3D9CF4]
              text-white
              text-[28px]
              font-black
              tracking-[2px]
              transition-all
              hover:scale-105
            "
          >
            VIEW RESULTS →
          </button>

          <div className="w-px h-20 bg-[#CCD5DF]" />

          <div className="w-[240px] text-center">
            <p className="text-[13px] uppercase tracking-[2px] text-[#8E99A9] font-semibold">
              OF 5,000 POINTS
            </p>

            <div className="flex justify-center items-end gap-2 mt-1">
              <span className="text-[56px] font-black text-[#282C34]">
                {animatedPoints.toLocaleString()}
              </span>

              <span className="text-[22px] mb-2 font-bold text-[#8E99A9]">
                pts
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}