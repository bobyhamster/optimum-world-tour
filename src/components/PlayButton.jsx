export default function PlayButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        absolute

        left-1/2
        -translate-x-1/2

        top-[42%]

        w-[min(600px,80vw)]
        h-[clamp(72px,10vh,100px)]

        rounded-full

        bg-gradient-to-b
        from-[#FFFBFB]
        to-[#FFFBFB]

        text-black
        text-[clamp(36px,4vw,60px)]
        font-black

        hover:scale-105
        transition-all

        z-50
      "
    >
      PLAY
    </button>
  );
}