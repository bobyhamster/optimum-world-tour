export default function GuideModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md">

      <div className="relative w-[760px] rounded-[32px] border border-[#3B414B] bg-[#2C3138] p-8 shadow-[0_30px_100px_rgba(0,0,0,.5)]">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-3xl text-[#B0BED1] hover:text-white"
        >
          ×
        </button>

        <h2 className="text-[34px] font-bold text-white">
          HOW TO PLAY
        </h2>

        <p className="mt-3 text-[#B0BED1] text-lg">
          Learn how the Optimum World Tour works before
          starting your first journey.
        </p>

        {/* Placeholder */}
        <div className="mt-8 flex h-[280px] items-center justify-center rounded-[24px] bg-[#1E232B] text-[#708090] text-xl">
          VIDEO / IMAGE
        </div>

        <div className="mt-8 space-y-3 text-[#D3DBE2] text-lg">
          <p>• Explore the world</p>
          <p>• Guess the correct country</p>
          <p>• Earn XP after every round</p>
          <p>• Climb the leaderboard</p>
        </div>

        <button
          onClick={onClose}
          className="mt-8 h-[58px] w-full rounded-full bg-white text-[#282C34] text-lg font-semibold hover:bg-[#EEF2F6]"
        >
          START PLAYING
        </button>

      </div>
    </div>
  );
}