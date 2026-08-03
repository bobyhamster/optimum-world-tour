export default function SideCard({
  left,
  right,
  title,
  text,
}) {

  return (

    <div
      className={`
      absolute
      top-56

      ${left ? "left-14" : ""}
      ${right ? "right-14" : ""}

      w-[320px]

      rounded-[32px]

      bg-[#33363C]/80

      backdrop-blur-xl

      border
      border-[#4B5563]

      p-8
      `}
    >

      <h2 className="text-white text-3xl font-bold">

        {title}

      </h2>

      <p className="mt-6 text-[#D3DBE2]">

        {text}

      </p>

    </div>

  );

}