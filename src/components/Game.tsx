"use client";

import messi from "../assets/Players/messi.jpeg";
import cr7 from "../assets/Players/cr7.jpeg";
import mbappe from "../assets/Players/Mbappe.jpeg";
import haaland from "../assets/Players/haalnd.jpeg";
import debruyne from "../assets/Players/debruyne.jpeg";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      feedbackMessage =
        "Congratulations! You guessed both the player and the club correctly!";
      pointsGained = 2;
    } else if (nameGuess.toLowerCase() === currentPlayer.name.toLowerCase()) {
      feedbackMessage = `Correct player name, but the club is ${currentPlayer.club}.`;
      pointsGained = 1;
    } else if (clubGuess.toLowerCase() === currentPlayer.club.toLowerCase()) {
      feedbackMessage = `Correct club, but the player name is ${currentPlayer.name}.`;
      pointsGained = 1;
    } else {
      feedbackMessage = `Sorry, that's incorrect. The player is ${currentPlayer.name} from ${currentPlayer.club}.`;
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
      <Card className="w-[350px] mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Football Player Guessing Game
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">How many players do you want to guess?</p>
          <Select
            value={numberOfPlayers.toString()}
            onValueChange={(value) => setNumberOfPlayers(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select number of players" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} player{num !== 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={startGame} className="w-full">
            Start Game
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === "over") {
    return (
      <Card className="w-[350px] mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Game Over!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center font-semibold">
            Your final score: {score}/{numberOfPlayers * 2}
          </p>
          <Button onClick={() => setGameState("setup")} className="w-full">
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentPlayer = players[currentPlayerIndex];

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Guess the Player
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          {currentPlayer && (
            <img
              src={currentPlayer.imageUrl}
              alt="Football player"
              width={200}
              height={300}
              className="mx-auto mb-4"
            />
          )}
          <p className="font-semibold">
            Score: {score}/{numberOfPlayers * 2}
          </p>
          <p className="text-sm text-muted-foreground">
            Player {currentPlayerIndex + 1} of {numberOfPlayers}
          </p>
        </div>
        <Input
          type="text"
          placeholder="Player Name"
          value={nameGuess}
          onChange={(e) => setNameGuess(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Club"
          value={clubGuess}
          onChange={(e) => setClubGuess(e.target.value)}
        />
        <Button onClick={checkGuess} className="w-full">
          Submit Guess
        </Button>
        {feedback && <p className="text-center font-medium">{feedback}</p>}
        {showCorrectAnswer && (
          <p className="text-center font-medium">
            The correct answer is {currentPlayer.name} from {currentPlayer.club}
            .
          </p>
        )}
      </CardContent>
    </Card>
  );
}
