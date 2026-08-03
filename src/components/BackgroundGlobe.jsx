import globe from "../assets/globe.mp4";

export default function BackgroundGlobe() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">

      {/* Свечение */}
      <div
        className="
          absolute
          w-[1500px]
          h-[1500px]
          rounded-full
          bg-[#51B1FE]/10
          blur-[180px]
        "
      />

      {/* Планета */}
      <img
        src={globe}
        alt=""
        className="
          w-[1850px]
          max-w-none
          opacity-75
          pointer-events-none
          select-none
        "
      />

      {/* Затемнение */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-[#282C34]/10
          via-transparent
          to-[#282C34]
        "
      />

    </div>
  );
}