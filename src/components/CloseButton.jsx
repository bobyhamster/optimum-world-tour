import closeIcon from "../assets/close-icon.png"; // <-- Вкажіть шлях до вашого файлу PNG

export default function CloseButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        absolute
        top-6
        right-6
        w-11
        h-11
        rounded-full
        bg-[#2F343C]
        border
        border-[#40464F]
        flex
        items-center
        justify-center
        transition-all
        duration-200
        hover:bg-[#373D46]
        hover:border-[#51B1FE]
        hover:shadow-[0_0_18px_rgba(81,177,254,.15)]
        hover:scale-105
        active:scale-95
      "
      aria-label="Close"
    >
      <img
        src={closeIcon}
        alt="Close"
        className="w-5 h-5 object-contain pointer-events-none select-none opacity-80 group-hover:opacity-100 transition-opacity"
      />
    </button>
  );
}