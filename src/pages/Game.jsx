import { useState, useEffect, useRef } from "react";
import locations from "../data/locations";
import MiniMap from "../components/MiniMap";
import PanoramaViewer from "../components/PanoramaViewer";
import MapPanel from "../components/MapPanel";
import ResultPanel from "../components/ResultPanel";
import ReviewResults from "../components/ReviewResults";
import facts from "../data/facts";
import FinalRoundPanel from "../components/FinalRoundPanel";
import LeaderboardModal from "../components/LeaderboardModal";



import FactCard from "../components/FactCard";
import { supabase } from "../lib/supabase";
import scoreSound from "../assets/audio/score.mp3";


function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
export default function Game({ onExit }) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [animatedDistance, setAnimatedDistance] = useState(0);
  const [animatedPoints, setAnimatedPoints] = useState(0);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameLocations, setGameLocations] = useState(() =>
  shuffle(locations).slice(0, 5)
);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [distance, setDistance] = useState(null);
  const [points, setPoints] = useState(null);
  const [results, setResults] = useState([]);
const [showSummary, setShowSummary] = useState(false);
const [showLeaderboard, setShowLeaderboard] = useState(false);
const scoreAudioRef = useRef(null);

  const currentLocation = gameLocations[round];
  const factImage = facts[currentLocation.id] || null;
  function handleGuess() {
    if (!selectedPosition) return;

    const distance = getDistance(
      selectedPosition.lat,
      selectedPosition.lng,
      currentLocation.lat,
      currentLocation.lng
    );
    const points = Math.max(
      0,
      Math.round(5000 * Math.exp(-distance / 2000))
    );

    setResults((prev) => [
  ...prev,
  {
    round: round + 1,
    score: points,
    distance,

    guess: {
      lat: selectedPosition.lat,
      lng: selectedPosition.lng,
    },

    correct: {
      lat: currentLocation.lat,
      lng: currentLocation.lng,
    },

    location: currentLocation,
  },
]);
    setDistance(distance);
    setPoints(points);
    setScore(prev => prev + points);

    console.log("Distance:", distance.toFixed(2), "km");
    console.log("Score:", points);

    console.log("Distance:", distance.toFixed(2), "km");

    setHasGuessed(true);
  }
  useEffect(() => {
    // Если раунд уже закончился — таймер не нужен
    if (hasGuessed) return;

    const interval = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(interval);

  }, [hasGuessed]);

  useEffect(() => {
    if (!hasGuessed || distance == null || points == null) return;
    scoreAudioRef.current = new Audio(scoreSound);
scoreAudioRef.current.volume = 0.35;
scoreAudioRef.current.play().catch(() => {});

    let frame;
    let start;

    const duration = 1000; // 1 секунда

    function animate(timestamp) {
      if (!start) start = timestamp;

      const progress = Math.min((timestamp - start) / duration, 1);

      setAnimatedDistance(Math.round(distance * progress));
      setAnimatedPoints(Math.round(points * progress));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);

    return () => {
  cancelAnimationFrame(frame);

  scoreAudioRef.current?.pause();
  scoreAudioRef.current = null;
};
  }, [hasGuessed, distance, points]);

  function handleTimeUp() {
    if (hasGuessed) return;

    if (selectedPosition) {
      handleGuess();
      return;
    }
    

    setDistance(null);
    setPoints(0);
    setHasGuessed(true);
  }
  async function saveGameResult() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return;

  const userId = session.user.id;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("points, games, wins")
    .eq("id", userId)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      points: Math.max(profile.points, score),
      games: profile.games + 1,
    })
    .eq("id", userId);

  if (updateError) {
    console.error(updateError);
  }
}

function restartGame() {
  setGameLocations(shuffle(locations).slice(0, 5));

  setRound(0);

  setScore(0);

  setResults([]);

  setSelectedPosition(null);

  setHasGuessed(false);

  setDistance(null);

  setPoints(null);

  setAnimatedDistance(0);

  setAnimatedPoints(0);

  setTimeLeft(120);

  setShowSummary(false);
}


  async function handleNextRound() {
   
  

 if (round >= gameLocations.length - 1) {
    await saveGameResult();

    setShowSummary(true);

    return;
}

setRound(prev => prev + 1);

  setHasGuessed(false);
  setSelectedPosition(null);

  setDistance(null);
  setPoints(null);

  setAnimatedDistance(0);
  setAnimatedPoints(0);

  setTimeLeft(120);

}
if (showSummary) {
  return (
    <ReviewResults
  score={score}
  results={results}

  onPlayAgain={restartGame}

  onLeaderboard={() => setShowLeaderboard(true)}

  onExit={onExit}
/>
  );
}
  return (
    <main className="relative min-h-screen bg-[#282C34] text-white flex flex-col">
      {!hasGuessed && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000]">

          <div
            className="
      w-[760px]
      h-[76px]

      rounded-[28px]

      bg-gradient-to-b
      from-[#FFFBFB]
      to-[#D3DBE2]

      border
      border-white/60

      backdrop-blur-xl

      shadow-[0_10px_35px_rgba(0,0,0,.18)]

      grid
grid-cols-[300px_1fr_300px]
w-full

      overflow-hidden
    "
          >

            {/* ROUND */}
<div className="w-full flex flex-col justify-center items-center border-r border-[#C9D2DB]/40">

              <span className="text-[10px] tracking-[5px] font-semibold text-[#8E99A9]">
                ROUND
              </span>

              <span className="mt-0.5 text-[34px] font-black leading-none text-[#282C34]">
                {round + 1} / {gameLocations.length}
              </span>

            </div>

            {/* TIME */}
<div className="w-full flex flex-col justify-center items-center border-r border-[#C9D2DB]/40">

              <span className="text-[10px] tracking-[5px] font-semibold text-[#8E99A9]">
                TIME
              </span>

              <span className="mt-0.5 text-[34px] font-black leading-none text-[#282C34]">
                {minutes}:{seconds}
              </span>

            </div>

            {/* SCORE */}
<div className="w-full flex flex-col justify-center items-center">

              <span className="text-[10px] tracking-[5px] font-semibold text-[#8E99A9]">
                SCORE
              </span>

              <span className="mt-0.5 text-[40px] font-black leading-none text-[#282C34]">
                {score.toLocaleString()}
              </span>

            </div>

          </div>

        </div>
      )}


      <div className="flex-1 relative overflow-visible min-h-0">

        {!hasGuessed ? (  
          <>
            <PanoramaViewer
              image={currentLocation.image}
              width={currentLocation.width}
              height={currentLocation.height}
            />

            <div className="absolute bottom-6 right-6">
  <MiniMap
    marker={selectedPosition}
    onMarkerChange={setSelectedPosition}
    correctPosition={{
      lat: currentLocation.lat,
      lng: currentLocation.lng,
    }}
    hasGuessed={hasGuessed}
    onGuess={handleGuess}
    canGuess={!!selectedPosition}
  />
</div>
          </>
        ) : (
          <>
          
           <div className="absolute inset-0">
              <MiniMap
                marker={selectedPosition}
                onMarkerChange={setSelectedPosition}
                correctPosition={{
                  lat: currentLocation.lat,
                  lng: currentLocation.lng,
                }}
                hasGuessed={hasGuessed}
                resultMode={true}
              />

              <div className="fixed left-15 top-30 z-[99999]">
  <FactCard image={factImage} />
</div>
            </div>
            {round === gameLocations.length - 1 ? (
  <FinalRoundPanel
    animatedDistance={animatedDistance}
    animatedPoints={animatedPoints}
    onViewResults={handleNextRound}
  />
) : (
  <ResultPanel
    animatedDistance={animatedDistance}
    animatedPoints={animatedPoints}
    factImage={factImage}
    onNext={handleNextRound}
  />
)}

          </>

        )}

      </div>
{showLeaderboard && (
  <LeaderboardModal
    onClose={() => setShowLeaderboard(false)}
  />
)}
    </main>
  );
}