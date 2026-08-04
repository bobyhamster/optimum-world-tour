export default function FactCard({ image }) {
    console.log("FactCard render", image);
  if (!image) return null;

  return (
    <div
  className="
    w-[430px]
    rounded-[30px]
    overflow-hidden
    shadow-[0_30px_70px_rgba(0,0,0,.35)]
  "
>
      <img
  src={image}
  alt="Fact"
  className="block w-full h-full object-cover"
  style={{
    verticalAlign: "top",
  }}
/>
    </div>
  );
}