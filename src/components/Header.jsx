export default function Header() {
  return (
    <header className="flex items-center gap-4 pt-2">
      <img
        src="/images/logo.png"
        alt="Optimum"
        className="h-[clamp(28px,3vh,36px)] w-auto"
      />

      <span className="text-white text-[clamp(12px,1vw,14px)] tracking-[10px] uppercase">
        OPTIMUM
      </span>
    </header>
  );
}