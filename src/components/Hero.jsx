import PlayButton from "./PlayButton";
import optimumLogo from "../assets/logo.png";

export default function Hero({ onStart }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center pt-[10%] pointer-events-none">
      <div className="flex flex-col items-center pointer-events-auto">
        <div className="flex items-start justify-center gap-0">

  <img
  src={optimumLogo}
  alt="Optimum"
  className="
    h-[60px]
    w-auto
  
    
    translate-y-[20px]
  "
/>

  <h1
    className="
      text-[clamp(64px,6vw,92px)]
      font-black
      leading-none
      text-white
    "
  >
    PTIMUM
  </h1>

</div>

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