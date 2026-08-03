import { DivIcon } from "leaflet";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polyline,
  useMapEvents,
  useMap,
  Marker
} from "react-leaflet";

          import { useState, useEffect } from "react";


          function ClickHandler({ onClick }) {
            useMapEvents({
              click(e) {
                onClick(e.latlng);
              },
            });

            return null;
          }

          function ResizeMap({ expanded }) {
            const map = useMap();

            useEffect(() => {
              setTimeout(() => {
                map.invalidateSize();
              }, 300);
            }, [expanded, map]);

            return null;
          }

          function FocusCorrectPosition({ hasGuessed, marker, correctPosition }) {
  const map = useMap();

  useEffect(() => {
    if (!hasGuessed || !marker || !correctPosition) return;
    console.log("FocusCorrectPosition");
console.log(marker);
console.log(correctPosition);

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

          export default function MiniMap({
            marker,
            onMarkerChange,
            correctPosition,
            hasGuessed,
            resultMode = false,
          }) {
            const [expanded, setExpanded] = useState(false);
            
          function handleMapClick(latlng) {
            if (hasGuessed) return;

            onMarkerChange(latlng);
          }
          console.log({
  marker,
  correctPosition,
  hasGuessed,
});
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
            return (
              <div 
              onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
              className={`
          transition-all
          duration-300
          overflow-hidden
          ${resultMode ? "" : "rounded-t-2xl border border-zinc-700 shadow-2xl bg-zinc-900"}
          ${
            resultMode
  ? "absolute inset-0"
              : expanded
                ? "w-[850px] h-[600px]"
                : "w-80 h-56"
          }
          `}
          >
                <MapContainer
                
  className="w-full h-full"
  center={[20, 0]}
  zoom={2}
  scrollWheelZoom={true}
  style={{ width: "100%", height: "100%" }}
>
                  {/* Оригинальные тайлы Google Maps без API-ключа */}
<TileLayer
  url="https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
  maxZoom={20}
  attribution="&copy; Google Maps"
/>
          <ResizeMap expanded={expanded || resultMode} />
          <FocusCorrectPosition
  hasGuessed={hasGuessed}
  marker={marker}
  correctPosition={correctPosition}
/> 


                  <ClickHandler onClick={handleMapClick} />
                  {marker && (
  <Marker
    position={marker}
    icon={playerIcon}
  />
)}
                  {hasGuessed && (
            <CircleMarker
              center={correctPosition}
              radius={8}
              pathOptions={{ color: "red", fillColor: "red", fillOpacity: 1 }}
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

                </MapContainer>
                
              </div>
            );
          }