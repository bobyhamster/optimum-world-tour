export default function Progress() {
  return (
    <div className="mt-12">

      <div className="flex items-center gap-3">

        <span className="text-[#51B1FE] text-3xl">
          🌍
        </span>

        <div>

          <div className="text-[#51B1FE] text-3xl font-semibold">
            0 / 24
          </div>

          <div className="text-[#9DB0C2]">
            Countries Discovered
          </div>

        </div>

      </div>

      <div className="flex gap-2 mt-6">

        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`h-[6px] rounded-full ${
              i === 0 ? "bg-[#51B1FE]" : "bg-[#33363C]"
            }`}
            style={{ width: 48 }}
          />
        ))}

      </div>

    </div>
  );
}