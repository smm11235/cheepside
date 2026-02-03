import { useEffect, useRef } from "react";
import { Game } from "phaser";
import { gameConfig } from "@game/config";
import { HUD } from "./components/HUD";
import { WordDisplay } from "./components/WordDisplay";
import { GameOverlay } from "./components/GameOverlay";

export function App() {
	const gameRef = useRef<Game | null>(null);

	useEffect(() => {
		if (gameRef.current) return;

		gameRef.current = new Game(gameConfig);

		return () => {
			gameRef.current?.destroy(true);
			gameRef.current = null;
		};
	}, []);

	return (
		<div id="game-container" style={{ width: "100%", height: "100%", position: "relative" }}>
			<HUD />
			<WordDisplay />
			<GameOverlay />
		</div>
	);
}
