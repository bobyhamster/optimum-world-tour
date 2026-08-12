import CloseButton from "./CloseButton";
import tutorialVideo from "../assets/videos/tutorial.mp4";

export default function GuideModal({ onClose, onStart }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-6 backdrop-blur-xl">
      <div className="relative w-full max-w-[820px] overflow-hidden rounded-[28px] border border-[#3B414B] bg-[#282C34] shadow-[0_30px_100px_rgba(0,0,0,0.65)]">

        {/* CLOSE BAR */}
        {/* CLOSE BAR */}
<div className="relative h-[52px] border-b border-[#3B414B] bg-[#282C34]">
  <div className="[&>button]:!top-1 [&>button]:!right-3">
    <CloseButton onClick={onClose} />
  </div>
</div>
        {/* VIDEO */}
        <div className="px-5 pt-5">
          <div className="overflow-hidden bg-black">
            <video
              src={tutorialVideo}
              controls
              playsInline
              preload="metadata"
              className="block aspect-video w-full"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-7 pb-7 pt-6">

  <div className="space-y-5">

    <div>
      <div className="text-[15px] font-semibold text-[#FFFBFB]">
         Press Play
      </div>
      <p className="mt-1 text-[14px] leading-5 text-[#9DB0C2]">
        Jump into Optimum World Tour and start your first round.
      </p>
    </div>

    <div>
      <div className="text-[15px] font-semibold text-[#FFFBFB]">
         Explore & Guess
      </div>
      <p className="mt-1 text-[14px] leading-5 text-[#9DB0C2]">
        Look around the location, search for clues, and guess the correct country.
      </p>
    </div>

    <div>
      <div className="text-[15px] font-semibold text-[#FFFBFB]">
         Discover the Team
      </div>
      <p className="mt-1 text-[14px] leading-5 text-[#9DB0C2]">
        After each round, unlock an interesting fact connected to someone from the Optimum ecosystem.
      </p>
    </div>

    <div>
      <div className="text-[15px] font-semibold text-[#FFFBFB]">
         Earn Points
      </div>
      <p className="mt-1 text-[14px] leading-5 text-[#9DB0C2]">
        The better your guess, the more points you can earn.
      </p>
    </div>

    <div>
      <div className="text-[15px] font-semibold text-[#FFFBFB]">
         Climb the Leaderboard
      </div>
      <p className="mt-1 text-[14px] leading-5 text-[#9DB0C2]">
        Collect points across the game and compete for a higher spot on the leaderboard.
      </p>
    </div>

  </div>

  

  <button
    onClick={onStart}
    className="
      mt-6
      h-[58px]
      w-full
      rounded-full
      bg-[#FFFBFB]
      text-[16px]
      font-semibold
      tracking-wide
      text-[#282C34]
      transition
      hover:bg-[#D3DBE2]
      active:scale-[0.99]
    "
  >
    START PLAYING
  </button>

</div>
      </div>
    </div>
  );
}