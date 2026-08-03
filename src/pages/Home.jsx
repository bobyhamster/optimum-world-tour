import Header from "../components/Header";
import Hero from "../components/Hero";
import MenuButtons from "../components/MenuButtons";
import backgroundVideo from "../assets/videos/background.mp4";
import InfoCard from "../components/InfoCard";
import BottomCards from "../components/BottomCards";
import { useState } from "react";
import GuideModal from "../components/GuideModal";
import LeaderboardModal from "../components/LeaderboardModal";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import NicknameModal from "../components/NicknameModal";
import { usePlayer } from "../contexts/PlayerContext";

console.log(NicknameModal);



export default function Home({ onStart }) {
  const [showGuide, setShowGuide] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
const [showNickname, setShowNickname] = useState(false);
const { player, setPlayer } = usePlayer();

  useEffect(() => {
  async function init() {
    let session = null;

    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    session = currentSession;

    console.log("SESSION:", session);

    if (!session) {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.error(error);
        return;
      }

      session = data.session;
    }

    setPlayer(session.user);

const { data: profile, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", session.user.id)
  .single();

if (error && error.code !== "PGRST116") {
  console.error(error);
  return;
}

if (!profile) {
  // Первый вход — показать окно выбора ника
  setShowNickname(true);
} else {
  // Профиль уже существует
  console.log("Welcome back:", profile.nickname);
}

console.log("PLAYER:", session.user);
  }

  init();
}, []);
async function saveNickname(nickname) {
  if (!player) return;

  const { error } = await supabase
    .from("profiles")
    .insert({
      id: player.id,
      nickname: nickname,
    });

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  console.log("PROFILE CREATED");

  setShowNickname(false);
}
  return (
    <main className="relative h-screen overflow-hidden">
      <video
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src={backgroundVideo} type="video/mp4" />
</video>



<InfoCard
  onOpenGuide={() => setShowGuide(true)}
/>
  

<div className="grid min-h-screen grid-cols-2"></div>
      <div className="grid min-h-screen grid-cols-2">
        <div className="p-10">
          <Header />

          <div className="mt-16">
            <Hero onStart={onStart} />
          </div>

          <div className="mt-12">
            <MenuButtons />
          </div>
        </div>
<BottomCards
  onOpenLeaderboard={() => setShowLeaderboard(true)}
/>

{showGuide && (
  <GuideModal
    onClose={() => setShowGuide(false)}
    onStart={() => {
      setShowGuide(false);
      onStart();
    }}
  />
)}
        
      </div>
      {showLeaderboard && (
  <LeaderboardModal
    onClose={() => setShowLeaderboard(false)}
  />
)}
{showNickname && (
  <NicknameModal
    onSubmit={saveNickname}
  />
)}
    </main>
    
  );
}