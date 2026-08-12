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
import Compass from "../components/Compass";

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

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Game({ onExit }) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [animatedDistance, setAnimatedDistance] = useState(0);
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [heading, setHeading] = useState(0);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
 const [gameLocations, setGameLocations] = useState([]);
const [gameSessionId, setGameSessionId] = useState(null);
const [gameLoading, setGameLoading] = useState(true);
const sessionStartedRef = useRef(false);
useEffect(() => {
  if (sessionStartedRef.current) return;

  sessionStartedRef.current = true;

  async function startServerGame() {
    setGameLoading(true);

    const { data, error } = await supabase.rpc("start_game_session");

    if (error) {
      console.error("Failed to start game session:", error);
      setGameLoading(false);
      return;
    }

    const session = data?.[0];

    if (!session) {
      console.error("No game session returned");
      setGameLoading(false);
      return;
    }

    const locationIds = session.location_ids;

    const selectedLocations = locationIds
      .map((id) => locations.find((location) => location.id === id))
      .filter(Boolean);

    if (selectedLocations.length !== locationIds.length) {
      console.error("Some server locations were not found locally");
      setGameLoading(false);
      return;
    }

    setGameSessionId(session.session_id);
    setGameLocations(selectedLocations);
    setGameLoading(false);
  }

  startServerGame();
}, []);

  useEffect(() => {
    gameLocations.forEach((location) => {
      if (location?.image) {
        const img = new Image();
        img.src = location.image;
      }

      const factImage = facts[location.id];

      if (factImage) {
        const fact = new Image();
        fact.src = factImage;
      }
    });
  }, [gameLocations]);

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [distance, setDistance] = useState(null);
  const [points, setPoints] = useState(null);
  const [results, setResults] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const scoreAudioRef = useRef(null);

  const currentLocation = gameLocations[round];
const factImage = currentLocation
  ? facts[currentLocation.id] || null
  : null;

  useEffect(() => {
    if (!currentLocation) return;

    const img = new Image();
    img.src = currentLocation.image;

    if (factImage) {
      const fact = new Image();
      fact.src = factImage;
    }
  }, [currentLocation, factImage]);

  async function handleGuess() {
  if (!selectedPosition || !currentLocation || !gameSessionId) return;

  const { data, error } = await supabase.rpc("submit_guess", {
    p_session_id: gameSessionId,
    p_round: round,
    p_guess_lat: selectedPosition.lat,
    p_guess_lng: selectedPosition.lng,
  });

  if (error) {
    console.error("Failed to submit guess:", error);
    return;
  }

  const result = data?.[0];

  if (!result) {
    console.error("No result returned from submit_guess");
    return;
  }

  const serverDistance = Number(result.distance);
  const serverPoints = Number(result.score);

  setResults((prev) => [
    ...prev,
    {
      round: round + 1,
      score: serverPoints,
      distance: serverDistance,
      guess: {
        lat: selectedPosition.lat,
        lng: selectedPosition.lng,
      },
      correct: {
        lat: Number(result.correct_lat),
        lng: Number(result.correct_lng),
      },
      location: currentLocation,
    },
  ]);

  setDistance(serverDistance);
  setPoints(serverPoints);
  setScore((prev) => prev + serverPoints);
  setHasGuessed(true);
}

  useEffect(() => {
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

    const duration = 1000;

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

  

  async function restartGame() {
  setGameLoading(true);
  setShowSummary(false);

  const { data, error } = await supabase.rpc("start_game_session");

  if (error) {
    console.error("Failed to start new game:", error);
    setGameLoading(false);
    return;
  }

  const session = data?.[0];

  if (!session) {
    console.error("No new game session returned");
    setGameLoading(false);
    return;
  }

  const locationIds = session.location_ids;

  const selectedLocations = locationIds
    .map((id) => locations.find((location) => location.id === id))
    .filter(Boolean);

  if (selectedLocations.length !== locationIds.length) {
    console.error("Some server locations were not found locally");
    setGameLoading(false);
    return;
  }

  setGameSessionId(session.session_id);
  setGameLocations(selectedLocations);

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

  setGameLoading(false);
}

  async function handleNextRound() {
  if (round >= gameLocations.length - 1) {
    setShowSummary(true);
    return;
  }

  setRound((prev) => prev + 1);
  setHasGuessed(false);
  setSelectedPosition(null);
  setDistance(null);
  setPoints(null);
  setAnimatedDistance(0);
  setAnimatedPoints(0);
  setTimeLeft(120);
}

  if (gameLoading || !currentLocation) {
  return (
    <main className="min-h-screen bg-[#282C34] flex items-center justify-center text-white">
      <div className="text-sm tracking-[4px] uppercase text-white/50">
        Loading game...
      </div>
    </main>
  );
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
              initialHeading={currentLocation.heading || currentLocation.northOffset || 0}
              onHeadingChange={setHeading}
            />

            <Compass heading={heading} />

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
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}
    </main>
  );
}