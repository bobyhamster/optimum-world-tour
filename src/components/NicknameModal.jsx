import { useState } from "react";
import logo from "../assets/logo.png"; // <-- перевір шлях до логотипа

export default function NicknameModal({ onSubmit }) {
  const [nickname, setNickname] = useState("");

  const isValid = nickname.trim().length >= 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(nickname.trim());
    }
  };

  return (
    /* Background Overlay */
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(5, 6, 8, 0.85)",
        backdropFilter: "blur(12px)",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Modal Box */}
      <div
        style={{
          width: "560px",
          maxWidth: "95vw",
          flexShrink: 0,
          borderRadius: "32px",
          border: "1px solid #1E232A",
          backgroundColor: "#0F1116",
          padding: "48px 40px",
          boxShadow:
            "0 0 100px rgba(0, 0, 0, 0.95), inset 0 1px 1px rgba(255, 255, 255, 0.05)",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <img
            src={logo}
            alt="Optimum"
            style={{
              height: "36px",
              width: "auto",
              objectFit: "contain",
              userSelect: "none",
            }}
            draggable={false}
          />
        </div>

        {/* Brand */}
        <p
          style={{
            margin: 0,
            marginBottom: "24px",
            textAlign: "center",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#606977",
            lineHeight: 1,
          }}
        >
          Optimum World Tour
        </p>

        {/* Title */}
        <h1
          style={{
            margin: 0,
            marginBottom: "16px",
            textAlign: "center",
            fontSize: "46px",
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#F8F9FA",
          }}
        >
          Choose your
          <br />
          nickname
        </h1>

        {/* Description */}
        <p
          style={{
            margin: 0,
            marginBottom: "36px",
            textAlign: "center",
            fontSize: "15px",
            lineHeight: 1.5,
            color: "#6E7785",
          }}
        >
          Choose a unique identity that will appear
          <br />
          across leaderboards and multiplayer lobbies.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Input Container */}
          <div
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* User SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                left: "20px",
                width: "20px",
                height: "20px",
                color: "#555E6C",
                pointerEvents: "none",
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zm3 13.5a6.75 6.75 0 00-13.5 0"
              />
            </svg>

            {/* Input Field */}
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              autoFocus
              placeholder="Enter your nickname"
              style={{
                height: "56px",
                width: "100%",
                borderRadius: "16px",
                border: "1px solid #1C2129",
                backgroundColor: "#090A0D",
                paddingLeft: "56px",
                paddingRight: "70px",
                fontSize: "15px",
                color: "#FFFFFF",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            {/* Counter */}
            <span
              style={{
                position: "absolute",
                right: "20px",
                fontSize: "12px",
                fontWeight: 500,
                color: "#4F5765",
                pointerEvents: "none",
              }}
            >
              {nickname.length} / 20
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid}
            style={{
              position: "relative",
              height: "56px",
              width: "100%",
              borderRadius: "9999px",
              backgroundColor: isValid ? "#EDEDF0" : "#282D37",
              color: isValid ? "#0F1116" : "#555E6C",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              border: "none",
              cursor: isValid ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: "60px",
              paddingRight: "60px",
              transition: "all 0.2s ease",
              boxSizing: "border-box",
            }}
          >
            <span>CONTINUE</span>

            {/* Кругла синя іконка зі стрілкою з InfoCard */}
            <div
              style={{
                position: "absolute",
                right: "6px",
                width: "44px",
                height: "44px",
                borderRadius: "9999px",
                backgroundColor: isValid ? "#51B1FE" : "#3A414A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isValid
                  ? "0 0 18px rgba(81, 177, 254, 0.45)"
                  : "none",
                transition: "all 0.2s ease",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isValid ? "white" : "#717A88"}
                style={{
                  transform: "rotate(90deg)", // повертаємо стрілку праворуч
                  display: "block",
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
        </form>
      </div>
    </div>
  );
}