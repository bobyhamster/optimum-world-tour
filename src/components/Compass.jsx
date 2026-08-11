import React from "react";

export default function Compass({ heading = 0 }) {
  return (
    <div className="absolute top-6 right-6 z-[1000] select-none pointer-events-none">
      {/* Зовнішнє напівпрозоре кільце GeoGuessr */}
      <div className="relative w-16 h-16 rounded-full bg-[#121824]/80 border-2 border-white/30 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center">
        
        {/* Нерухомий покажчик напрямку погляду камери */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500 z-30 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />

        {/* Рухомий диск із позначками сторін світу */}
        <div
          className="relative w-full h-full rounded-full transition-transform duration-75 ease-out flex items-center justify-center"
          style={{ transform: `rotate(${-heading}deg)` }}
        >
          {/* Сторона N (Північ) */}
          <span className="absolute top-1 text-[11px] font-black text-red-500 tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            N
          </span>
          {/* Сторона S (Південь) */}
          <span className="absolute bottom-1 text-[10px] font-bold text-white/70">
            S
          </span>
          {/* Сторона E (Схід) */}
          <span className="absolute right-1.5 text-[10px] font-bold text-white/70">
            E
          </span>
          {/* Сторона W (Захід) */}
          <span className="absolute left-1.5 text-[10px] font-bold text-white/70">
            W
          </span>

          {/* Стрілка компаса */}
          <div className="absolute w-[4px] h-10 flex flex-col items-center justify-between z-10">
            <div className="w-full h-[48%] bg-gradient-to-b from-red-500 to-red-600 rounded-t-sm shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
            <div className="w-full h-[48%] bg-gradient-to-b from-white/90 to-slate-300 rounded-b-sm shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
          </div>

          {/* Центральний шарнір */}
          <div className="absolute w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-700 shadow-md z-20" />
        </div>
      </div>
    </div>
  );
}