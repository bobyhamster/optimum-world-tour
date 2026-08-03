
export default function InfoCard({ onOpenGuide }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '40px',
        top: '62%',
        transform: 'translateY(-50%)',
        width: '320px',
        backgroundColor: 'rgba(44, 49, 56, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '28px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
        overflow: 'hidden',
        zIndex: 50,
        /* Зменшені відступи з боків (12px), щоб кнопка була максимальної ширини */
        padding: '24px 12px 14px 12px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Текстовий блок з відступами */}
      <div style={{ width: '100%', padding: '0 10px', boxSizing: 'border-box' }}>
        <h2
          style={{
            margin: 0,
            padding: 0,
            color: '#FFFFFF',
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            lineHeight: 1.2,
          }}
        >
          HOW TO PLAY
        </h2>

        <p
          style={{
            margin: '10px 0 0 0',
            padding: 0,
            color: '#C0C8D0',
            fontSize: '15px',
            lineHeight: '1.5',
            fontWeight: 400,
          }}
        >
          Learn how the Optimum World Tour works before starting your first journey.
        </p>
      </div>

      {/* Збільшена кнопка (68px) */}
      <button
      onClick={onOpenGuide}
        className="
          w-full
          h-[68px]
          rounded-full
          bg-[#FFFBFB]
          border-none
          outline-none
          cursor-pointer
          transition-all
          duration-300
          ease-out
          hover:bg-[#F5F7FA]
          hover:shadow-[0_10px_25px_rgba(81,177,254,0.35)]
          active:scale-[0.98]
          group
        "
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '60px',
          paddingRight: '60px',
          boxSizing: 'border-box',
        }}
      >
        {/* Збільшений текст кнопки */}
        <span
          style={{
            color: '#2C3138',
            fontSize: '19px',
            fontWeight: 800,
            letterSpacing: '0.03em',
            whiteSpace: 'nowrap',
          }}
        >
          START TOUR
        </span>

        {/* Збільшена синя кругла іконка (46px) з новою каплеподібною стрілкою */}
        <div
          className="
            w-[46px]
            h-[46px]
            rounded-full
            bg-[#51B1FE]
            flex
            items-center
            justify-center
            shadow-[0_0_18px_rgba(81,177,254,0.45)]
            transition-transform
            duration-300
            group-hover:scale-105
            group-hover:-translate-y-0.5
            group-hover:translate-x-0.5
          "
          style={{
            position: 'absolute',
            right: '10px',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
            style={{
              transform: 'rotate(45deg)', // Нахил стрілки по діагоналі вгору-вправо
            }}
          >
            {/* Округлений стовпчик стрілки */}
            <path d="M12 21C10.8954 21 10 20.1046 10 19C10 17.8954 10.8954 17 12 17C13.1046 17 14 17.8954 14 19C14 20.1046 13.1046 21 12 21Z" />
            <path d="M12 16.5C10.8954 16.5 10 15.6046 10 14.5C10 13.3954 10.8954 12.5 12 12.5C13.1046 12.5 14 13.3954 14 14.5C14 15.6046 13.1046 16.5 12 16.5Z" />
            <path d="M12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12Z" />
            <path d="M12 7.5C10.8954 7.5 10 6.60457 10 5.5C10 4.39543 10.8954 3.5 12 3.5C13.1046 3.5 14 4.39543 14 5.5C14 6.60457 13.1046 7.5 12 7.5Z" />
            
            {/* Ліве округлене бокове вушко */}
            <path d="M7.5 10C6.39543 10 5.5 9.10457 5.5 8C5.5 6.89543 6.39543 6 7.5 6C8.60457 6 9.5 6.89543 9.5 8C9.5 9.10457 8.60457 10 7.5 10Z" />
            <path d="M4.5 13C3.39543 13 2.5 12.1046 2.5 11C2.5 9.89543 3.39543 9 4.5 9C5.60457 9 6.5 9.89543 6.5 11C6.5 12.1046 5.60457 13 4.5 13Z" />

            {/* Праве округлене бокове вушко */}
            <path d="M16.5 10C15.3954 10 14.5 9.10457 14.5 8C14.5 6.89543 15.3954 6 16.5 6C17.6046 6 18.5 6.89543 18.5 8C18.5 9.10457 17.6046 10 16.5 10Z" />
            <path d="M19.5 13C18.3954 13 17.5 12.1046 17.5 11C17.5 9.89543 18.3954 9 19.5 9C20.6046 9 21.5 9.89543 21.5 11C21.5 12.1046 20.6046 13 19.5 13Z" />
          </svg>
        </div>
      </button>
    </div>
  );
}