import { useEffect, useRef, useState } from "react";
import { Game } from "phaser";
import { gameConfig } from "@game/config";
import { gameManager } from "@game/systems/GameManager";
import { HUD } from "./components/HUD";
import { WordDisplay } from "./components/WordDisplay";
import { GameOverlay } from "./components/GameOverlay";
import { MenuOverlay } from "./components/MenuOverlay";

export function App() {
	const gameRef = useRef<Game | null>(null);
	const [showMenu, setShowMenu] = useState(true);
	const [gameStarted, setGameStarted] = useState(false);

	useEffect(() => {
		if (gameRef.current) return;

		gameRef.current = new Game(gameConfig);

		return () => {
			gameRef.current?.destroy(true);
			gameRef.current = null;
		};
	}, []);

	const handleNewGame = () => {
		setShowMenu(false);
		setGameStarted(true);
		gameManager.restartMatch();
	};

	const handleContinue = () => {
		setShowMenu(false);
		gameManager.unpause();
	};

	const handlePause = () => {
		gameManager.pause();
		setShowMenu(true);
	};

	return (
		<div id="game-container" style={{ width: "100%", height: "100%", position: "relative" }}>
			<HUD onPause={handlePause} />
			<WordDisplay />
			<GameOverlay />
			<MenuOverlay
				isVisible={showMenu}
				canContinue={gameStarted}
				onNewGame={handleNewGame}
				onContinue={handleContinue}
			/>
		</div>
	);
}
