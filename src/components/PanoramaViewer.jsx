import { useEffect, useRef } from "react";
import Marzipano from "marzipano";

export default function PanoramaViewer({
  image,
  width,
  height,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const viewer = new Marzipano.Viewer(containerRef.current, {
      controls: {
        mouseViewMode: "drag",
      },
    });

    const source = Marzipano.ImageUrlSource.fromString(image);

    const geometry = new Marzipano.EquirectGeometry([
      {
        width,
      },
    ]);

    const limiter = Marzipano.RectilinearView.limit.traditional(
      width,
      (150 * Math.PI) / 180
    );

    const view = new Marzipano.RectilinearView(
      {
        yaw: 0,
        pitch: 0,
        fov: (110 * Math.PI) / 180,
      },
      limiter
    );

    const scene = viewer.createScene({
      source,
      geometry,
      view,
      pinFirstLevel: true,
    });

    scene.switchTo({
      transitionDuration: 0,
    });

    return () => {
      viewer.destroy();
    };
  }, [image, width]);

  return (
  <div
    ref={containerRef}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      cursor: "grab",
    }}
  />
);
}