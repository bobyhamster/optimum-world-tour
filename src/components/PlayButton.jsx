export default function PlayButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        absolute

        left-1/2
        -translate-x-1/2

        top-[410px]

        w-[600px]
        h-[100px]

        rounded-full

        bg-gradient-to-b
        from-[#FFFBFB]
        to-[#FFFBFB]

        text-black
        text-[60px]
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