import { DivIcon } from "leaflet";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polyline,
  useMapEvents,
  useMap,
  Marker,
  ZoomControl,
} from "react-leaflet";
import { useState, useEffect } from "react";
import mapClickSound from "../assets/audio/map-click.mp3";

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });

  return null;
}

function ResizeMap({ isChanging }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();

    const interval = setInterval(() => {
      map.invalidateSize();
    }, 16);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      map.invalidateSize();
    }, 350);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isChanging, map]);

  return null;
}

function FocusCorrectPosition({ hasGuessed, marker, correctPosition }) {
  const map = useMap();

  useEffect(() => {
    if (!hasGuessed || !marker || !correctPosition) return;

    const timeout = setTimeout(() => {
      map.fitBounds(
        [
          [marker.lat, marker.lng],
          [correctPosition.lat, correctPosition.lng],
        ],
        {
          padding: [40, 40],
          maxZoom: 10,
          animate: true,
        }
      );
    }, 0);

    return () => clearTimeout(timeout);
  }, [hasGuessed, marker, correctPosition, map]);

  return null;
}

function FocusAllResults({ reviewMode, results }) {
  const map = useMap();

  useEffect(() => {
    if (!reviewMode || results.length === 0) return;

    const bounds = [];

    results.forEach((r) => {
      bounds.push([r.guess.lat, r.guess.lng]);
      bounds.push([r.correct.lat, r.correct.lng]);
    });

    setTimeout(() => {
      map.flyToBounds(bounds, {
        padding: [120, 120],
        duration: 2,
        maxZoom: 5,
      });
    }, 200);
  }, [reviewMode, results, map]);

  return null;
}

export default function MiniMap({
  marker,
  onMarkerChange,
  correctPosition,
  hasGuessed,
  resultMode = false,
  reviewMode = false,
  results = [],
  onGuess,
  canGuess = false,
}) {
  const [expanded, setExpanded] = useState(false);
  const [fullMap, setFullMap] = useState(false);

  function handleMapClick(latlng) {
  if (hasGuessed) return;

  const audio = new Audio(mapClickSound);
  audio.volume = 0.25;
  audio.play().catch(() => {});

  onMarkerChange(latlng);
}

  const playerIcon = new DivIcon({
    className: "",
    html: `
      <div class="player-marker">
        <div style="
          width:28px;
          height:28px;
          border-radius:50%;
          background:rgba(81,177,254,.25);
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:
            0 0 18px rgba(81,177,254,.55),
            0 0 34px rgba(81,177,254,.25);
        ">
          <div style="
            width:16px;
            height:16px;
            border-radius:50%;
            background:#51B1FE;
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <div style="
              width:7px;
              height:7px;
              border-radius:50%;
              background:white;
            "></div>
          </div>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  const correctIcon = new DivIcon({
    className: "",
    html: `
      <div style="
        width:22px;
        height:22px;
        border-radius:50%;
        background:#ff4757;
        box-shadow:
          0 0 16px rgba(255,71,87,.55),
          0 0 30px rgba(255,71,87,.35);
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        fixed right-6 bottom-6 flex flex-col gap-3 transition-all duration-300 ease-in-out pointer-events-auto
        ${
          resultMode || reviewMode
            ? "inset-0 w-screen h-screen z-[999] p-0"
            : fullMap
            ? "top-27 w-[1250px] max-w-[calc(100vw-48px)] z-[999]"
            : expanded
            ? "w-[850px] h-[600px] z-[900]"
            : "w-80 h-72 z-[900]"
        }
      `}
    >
      {/* Контейнер Карти */}
      <div className="relative w-full flex-1 overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#1e1e1e]">
        {!resultMode && !reviewMode && (
          <div className="absolute top-3 right-3 z-[99999]">
            <button
  onClick={(e) => {
    e.stopPropagation();
    setFullMap((prev) => !prev);
  }}
  className="w-9 h-9 rounded-xl bg-[#33363C]/90 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 hover:border-[#51B1FE] hover:shadow-[0_0_15px_rgba(81,177,254,.35)] active:scale-95"
>
  {fullMap ? (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
    </svg>
  ) : (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  )}
</button>
          </div>
        )}

        <MapContainer
          className="w-full h-full"
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={true}
          zoomControl={false}
          attributionControl={false}
          doubleClickZoom={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
            maxZoom={20}
          />

          <ZoomControl position="topleft" />

          <ResizeMap isChanging={`${expanded}-${fullMap}-${resultMode}-${reviewMode}`} />

          <FocusCorrectPosition
            hasGuessed={hasGuessed}
            marker={marker}
            correctPosition={correctPosition}
          />

          <FocusAllResults reviewMode={reviewMode} results={results} />

          {!reviewMode && <ClickHandler onClick={handleMapClick} />}

          {reviewMode ? (
            <>
              {results.map((r, i) => (
                <Marker key={"guess-" + i} position={r.guess} icon={playerIcon} />
              ))}

              {results.map((r, i) => (
                <Marker
                  key={"correct-" + i}
                  position={r.correct}
                  icon={correctIcon}
                />
              ))}

              {results.map((r, i) => (
                <Polyline
                  key={"line-" + i}
                  positions={[r.guess, r.correct]}
                  pathOptions={{
                    color: "#ff4757",
                    weight: 3,
                  }}
                />
              ))}
            </>
          ) : (
            <>
              {marker && <Marker position={marker} icon={playerIcon} />}

              {hasGuessed && (
                <CircleMarker
                  center={correctPosition}
                  radius={8}
                  pathOptions={{
                    color: "red",
                    fillColor: "red",
                    fillOpacity: 1,
                  }}
                />
              )}

              {hasGuessed && marker && (
                <Polyline
                  positions={[marker, correctPosition]}
                  pathOptions={{
                    color: "#ff4757",
                    weight: 3,
                  }}
                />
              )}
            </>
          )}
        </MapContainer>
      </div>

      {/* Єдина головна кнопка GUESS */}
      {!resultMode && !reviewMode && !hasGuessed && (
        <button
          disabled={!canGuess && !marker}
          onClick={onGuess}
          className={`
            w-full py-3.5 rounded-2xl font-bold text-lg uppercase tracking-wider
            transition-all duration-300 shadow-xl border shrink-0
            ${
              canGuess || marker
                ? "bg-[#51B1FE] text-black border-[#51B1FE] hover:bg-[#3ba1f2] hover:shadow-[0_0_20px_rgba(81,177,254,0.5)] active:scale-[0.99] cursor-pointer"
                : "bg-[#2a2d32] text-white/40 border-white/10 cursor-not-allowed"
            }
          `}
        >
          Guess
        </button>
      )}
    </div>
  );
}