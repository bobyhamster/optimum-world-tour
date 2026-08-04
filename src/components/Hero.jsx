import PlayButton from "./PlayButton";

export default function Hero({ onStart }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center pt-[10%] pointer-events-none">
      <div className="flex flex-col items-center pointer-events-auto">
        <h1
          className="
          text-[clamp(64px,6vw,92px)]
          font-black
          tracking-tight
          leading-none
          text-white
          "
        >
          OPTIMUM
        </h1>

        <h1
          className="
          text-[clamp(64px,6vw,92px)]
          font-black
          leading-none
          text-white
          "
        >
          WORLD TOUR
        </h1>

        <div className="mt-[clamp(24px,3vw,48px)]">
          <PlayButton onClick={onStart} />
        </div>
      </div>
    </div>
  );
}