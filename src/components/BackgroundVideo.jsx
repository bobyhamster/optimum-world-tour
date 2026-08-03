import video from "../assets/videos/background.mp4";

export default function BackgroundVideo() {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="
        absolute
        inset-0
        w-full
        h-full
        object-cover
        pointer-events-none
      "
    >
      <source src={video} type="video/mp4" />
    </video>
  );
}