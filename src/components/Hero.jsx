import PlayButton from "./PlayButton";

export default function Hero({ onStart }) {

  return (

    <div className="absolute inset-0 flex flex-col items-center pt-36">

      <h1
        className="
        text-[92px]
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
        text-[92px]
        font-black
        leading-none
        text-white
        "
      >
        WORLD TOUR
      </h1>

      <p
        className="
        mt-10
        text-2xl
       text-[#FFFBFB]
        text-center
        drop-shadow-[0_10px_40px_rgba(0,0,0,1)]
        "
      >
        
      </p>
<div className="mt-16" />
      <PlayButton onClick={onStart} />

    </div>

  );

}