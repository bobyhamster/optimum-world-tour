import Header from "../components/Header";
import Hero from "../components/Hero";
import MenuButtons from "../components/MenuButtons";
import backgroundVideo from "../assets/videos/background.mp4";
import InfoCard from "../components/InfoCard";
import BottomCards from "../components/BottomCards";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import GuideModal from "../components/GuideModal";
import LeaderboardModal from "../components/LeaderboardModal";
import NicknameModal from "../components/NicknameModal";
import { usePlayer } from "../contexts/PlayerContext";
import xIcon from "../assets/icons/x.svg";
import discordIcon from "../assets/icons/discord.svg";
import globeIcon from "../assets/icons/globe.svg";
import SocialButton from "../components/SocialButton";
import soundOnIcon from "../assets/icons/sound-on.svg";
import soundOffIcon from "../assets/icons/sound-off.svg";

export default function Home({ onStart }) {
  const [showGuide, setShowGuide] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNickname, setShowNickname] = useState(false);
  const { player, setPlayer } = usePlayer();
  const [videoLoaded, setVideoLoaded] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
  async function init() {
    try {
      let session = null;

      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("SESSION ERROR:", sessionError);
        return;
      }

      session = currentSession;

      // Нет сессии → создаём нового anonymous user
      if (!session) {
        const { data, error } =
          await supabase.auth.signInAnonymously();

        if (error) {
          console.error("ANONYMOUS AUTH ERROR:", error);
          return;
        }

        session = data.session;
      }

      console.log("CURRENT USER ID:", session.user.id);

      setPlayer(session.user);

      // Проверяем, есть ли профиль
      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("PROFILE ERROR:", profileError);
        return;
      }

      console.log("CURRENT PROFILE:", profile);

      // Профиля нет → показываем окно ника
      if (!profile || !profile.nickname) {
  console.log("NO NICKNAME → SHOW NICKNAME MODAL");
  setShowNickname(true);
} else {
  console.log("PROFILE EXISTS:", profile.nickname);
}
    } catch (error) {
      console.error("INIT ERROR:", error);
    }
  }

  init();
}, [setPlayer]);

  const tryPlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    tryPlay();

    const handleFirstInteraction = () => {
      tryPlay();
      window.removeEventListener("pointerdown", handleFirstInteraction);
    };

    window.addEventListener("pointerdown", handleFirstInteraction);
    return () => window.removeEventListener("pointerdown", handleFirstInteraction);
  }, []);

  const toggleSound = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
    } else {
      audio.volume = 0.3;
      audio.play().catch(console.error);
    }
  };
async function saveNickname(nickname) {
  if (!player) return;

  const cleanNickname = nickname.trim();

  if (!cleanNickname) return;

  const { data: existing, error: checkError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", player.id)
    .maybeSingle();

  if (checkError) {
    console.error("PROFILE CHECK ERROR:", checkError);
    return;
  }

  // Профиль уже существует → ничего не создаём
  if (existing) {
    console.log("PROFILE ALREADY EXISTS");
    setShowNickname(false);
    return;
  }

  // Профиля ещё нет → создаём его
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: player.id,
      nickname: cleanNickname,
      points: 0,
      games: 0,
      wins: 0,
      perfect_games: 0,
      game_time: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("CREATE PROFILE ERROR:", error);
    return;
  }

  console.log("PROFILE CREATED:", data);

  setShowNickname(false);
}
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <audio 
        ref={audioRef} 
        src="/audio/menu.mp3" 
        loop 
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <video
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      {!videoLoaded && (
  <div className="absolute inset-0 bg-black z-10" />
)}

      <InfoCard onOpenGuide={() => setShowGuide(true)} />

      <div className="absolute top-8 right-8 z-50 flex gap-4 items-center">
        <SocialButton href="https://x.com/getoptimum" icon={xIcon} alt="X" />
        <SocialButton href="https://discord.gg/hrcVUjXFy" icon={discordIcon} alt="Discord" />
        <SocialButton href="https://www.getoptimum.xyz" icon={globeIcon} alt="Website" />

        {/* Кнопка звуку, стилізована через SocialButton / кнопковий обгортку */}
        <div onClick={toggleSound} className="cursor-pointer">
          <SocialButton
            icon={isPlaying ? soundOnIcon : soundOffIcon}
            alt="Sound Toggle"
            onClick={toggleSound}
          />
        </div>
      </div>

      <div className="grid h-screen w-screen grid-cols-2">
        <div className="p-10">
          <Header />
          <div className="mt-16">
            <Hero onStart={onStart} />
          </div>
          <div className="mt-12">
            <MenuButtons />
          </div>
        </div>
        <BottomCards onOpenLeaderboard={() => setShowLeaderboard(true)} />
      </div>

      {showGuide && (
        <GuideModal
          onClose={() => setShowGuide(false)}
          onStart={() => {
            setShowGuide(false);
            onStart();
          }}
        />
      )}
      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
      {showNickname && (
  <NicknameModal onSubmit={saveNickname} />
)}
    </main>
  );
}