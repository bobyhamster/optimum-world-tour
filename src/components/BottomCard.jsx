export default function BottomCard({
  title,
  text,
}) {

  return (

    <div
      className="
      w-[420px]

      rounded-[30px]

      bg-[#33363C]/70

      border
      border-[#4B5563]

      backdrop-blur-xl

      p-8
      "
    >

      <h2 className="text-3xl text-white font-bold">

        {title}

      </h2>

      <p className="mt-4 text-[#D3DBE2]">

        {text}

      </p>

    </div>

  );

}