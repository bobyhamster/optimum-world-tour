export default function FactCard({ image }) {
    console.log("FactCard render", image);
  if (!image) return null;

  return (
    <div
      className="
w-[430px]

rounded-[30px]

overflow-hidden

border
border-white/70

shadow-[0_30px_70px_rgba(0,0,0,.35)]

transition-all
duration-500

opacity-100
translate-x-0
"
    >
      <img
        src={image}
        alt="Fact"
        className="w-full h-auto block"
      />
    </div>
  );
}