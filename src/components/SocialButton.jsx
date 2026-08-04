export default function SocialButton({ href, icon, alt }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        relative
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full

        bg-[#33363C]/85
        backdrop-blur-2xl

        border
        border-[#D3DBE2]/10

        shadow-[0_8px_24px_rgba(0,0,0,.25)]

        transition-all
        duration-300

        hover:-translate-y-1
        hover:scale-105
        hover:border-[#51B1FE]/60
        hover:shadow-[0_0_25px_rgba(81,177,254,.35)]

        active:scale-95
      "
    >
      <div
        className="
          absolute
          inset-0
          rounded-full
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
          bg-[radial-gradient(circle,rgba(81,177,254,.18)_0%,transparent_70%)]
        "
      />

      <img
        src={icon}
        alt={alt}
        className="
          relative
          z-10
          w-6
          h-6
          object-contain
          brightness-0
          invert
          transition-all
          duration-300
          group-hover:scale-110
        "
      />
    </a>
  );
}