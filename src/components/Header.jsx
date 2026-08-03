export default function Header() {
  return (
    <header className="flex items-center gap-4 pt-2">
      <img
        src="/images/logo.png"
        alt="Optimum"
        className="h-8 w-auto"
      />

      <span className="text-white text-sm tracking-[10px] uppercase">
        OPTIMUM
      </span>
    </header>
  );
}