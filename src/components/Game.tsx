"use client";

import messi from "../assets/Players/messi.jpeg";
import cr7 from "../assets/Players/cr7.jpeg";
import mbappe from "../assets/Players/Mbappe.jpeg";
import haaland from "../assets/Players/haalnd.jpeg";
import debruyne from "../assets/Players/debruyne.jpeg";
import { useState } from "react";

interface Player {
  id: number;
  name: string;
  club: string;
  imageUrl: string;
}

const initialPlayers: Player[] = [
  {
    id: 1,
    name: "Lionel Messi",
    club: "Inter Miami",
    imageUrl: messi,
  },
  {
    id: 2,
    name: "Cristiano Ronaldo",
    club: "Al Nassr",
    imageUrl: cr7,
  },
  {
    id: 3,
    name: "Kylian Mbappé",
    club: "Paris Saint-Germain",
    imageUrl: mbappe,
  },
  {
    id: 4,
    name: "Erling Haaland",
    club: "Manchester City",
    imageUrl: haaland,
  },
  {
    id: 5,
    name: "Kevin De Bruyne",
    club: "Manchester City",
    imageUrl: debruyne,
  },
];

export default function FootballGuessingGame() {
  const [gameState, setGameState] = useState<"setup" | "playing" | "over">(
    "setup"
  );
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [nameGuess, setNameGuess] = useState("");
  const [clubGuess, setClubGuess] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [numberOfPlayers, setNumberOfPlayers] = useState(3);

  const BackgroundPattern = () => (
    <div className="fixed inset-0 z-0">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <pattern
          id="grass-pattern"
          x="0"
          y="0"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 0h50v50H0z" fill="#2F7A34" />
          <circle cx="25" cy="25" r="2" fill="#266B2D" />
          <path d="M0 25h50" stroke="#266B2D" strokeWidth="0.5" />
          <path d="M25 0v50" stroke="#266B2D" strokeWidth="0.5" />
        </pattern>
        <pattern
          id="field-lines"
          x="0"
          y="0"
          width="200"
          height="200"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 100h200" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <path d="M100 0v200" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <circle
            cx="100"
            cy="100"
            r="30"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            fill="none"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grass-pattern)" />
        <rect width="100%" height="100%" fill="url(#field-lines)" />
      </svg>
    </div>
  );

  const shufflePlayers = () => {
    return [...initialPlayers]
      .sort(() => Math.random() - 0.5)
      .slice(0, numberOfPlayers);
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentPlayerIndex(0);
    setScore(0);
    setPlayers(shufflePlayers());
  };

  const nextPlayer = () => {
    setShowCorrectAnswer(false);
    if (currentPlayerIndex === players.length - 1) {
      setGameState("over");
    } else {
      setCurrentPlayerIndex((prevIndex) => prevIndex + 1);
    }
    setNameGuess("");
    setClubGuess("");
    setFeedback("");
  };

  const checkGuess = () => {
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer) return;

    let correctGuess = false;
    let feedbackMessage = "";
    let pointsGained = 0;

    if (
      nameGuess.toLowerCase() === currentPlayer.name.toLowerCase() &&
      clubGuess.toLowerCase() === currentPlayer.club.toLowerCase()
    ) {
      correctGuess = true;
      feedbackMessage = "GOOOAAAL! Perfect guess! 🎯⚽";
      pointsGained = 2;
    } else if (nameGuess.toLowerCase() === currentPlayer.name.toLowerCase()) {
      feedbackMessage = `Hit the post! Right player, but they play for ${currentPlayer.club} ⚽`;
      pointsGained = 1;
    } else if (clubGuess.toLowerCase() === currentPlayer.club.toLowerCase()) {
      feedbackMessage = `Close! Right club, but that's ${currentPlayer.name} ⚽`;
      pointsGained = 1;
    } else {
      feedbackMessage = `Off target! That's ${currentPlayer.name} from ${currentPlayer.club} ❌`;
      pointsGained = 0;
    }

    setScore((prevScore) => prevScore + pointsGained);
    setFeedback(feedbackMessage);
    setShowCorrectAnswer(!correctGuess);

    setTimeout(
      () => {
        nextPlayer();
      },
      correctGuess ? 2000 : 3000
    );
  };

  if (gameState === "setup") {
    return (
      <div className="min-h-screen relative">
        <BackgroundPattern />
        <div className="relative z-10 py-10 px-4">
          <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border-2 border-white">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-green-800">
                Football Legends Quiz
              </h2>
              <p className="text-center mb-6 text-gray-700 font-medium">
                Choose your match length:
              </p>
              <select
                className="w-full p-3 mb-6 border-2 border-green-200 rounded-lg bg-white/50 text-green-800 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={numberOfPlayers}
                onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} player{num !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <button
                onClick={startGame}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transform hover:scale-105 transition duration-300 shadow-lg"
              >
                Kick Off! ⚽
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "over") {
    return (
      <div className="min-h-screen relative">
        <BackgroundPattern />
        <div className="relative z-10 py-10 px-4">
          <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border-2 border-white">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-green-800">
                Full Time! 🏆
              </h2>
              <p className="text-center font-bold text-2xl mb-4 text-green-700">
                Final Score: {score}/{numberOfPlayers * 2}
              </p>
              <p className="text-center mb-6 text-gray-600">
                {score === numberOfPlayers * 2
                  ? "Perfect game! You're the champion! 🌟"
                  : "Good effort! Ready for another match?"}
              </p>
              <button
                onClick={() => setGameState("setup")}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transform hover:scale-105 transition duration-300 shadow-lg"
              >
                Play Again ⚽
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="min-h-screen relative">
      <BackgroundPattern />
      <div className="relative z-10 py-10 px-4">
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border-2 border-white">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="bg-green-100/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="font-bold text-green-800">
                  Score: {score}/{numberOfPlayers * 2}
                </p>
              </div>
              <div className="bg-green-100/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-green-800">
                  {currentPlayerIndex + 1}/{numberOfPlayers}
                </p>
              </div>
            </div>

            {currentPlayer && (
              <div className="relative mb-8">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={currentPlayer.imageUrl}
                    alt="Football player"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Player Name"
                value={nameGuess}
                onChange={(e) => setNameGuess(e.target.value)}
                className="w-full p-3 border-2 border-green-200 rounded-lg bg-white/80 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Club"
                value={clubGuess}
                onChange={(e) => setClubGuess(e.target.value)}
                className="w-full p-3 border-2 border-green-200 rounded-lg bg-white/80 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                onClick={checkGuess}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transform hover:scale-105 transition duration-300 shadow-lg"
              >
                Take the Shot! ⚽
              </button>
            </div>

            {feedback && (
              <div className="mt-6 p-4 bg-green-100/80 backdrop-blur-sm rounded-lg">
                <p className="text-center font-bold text-green-800">
                  {feedback}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
