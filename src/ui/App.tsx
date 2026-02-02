import { useEffect, useRef } from "react";
import { Game } from "phaser";
import { gameConfig } from "@game/config";

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
		<div id="game-container" style={{ width: "100%", height: "100%" }}>
			{/* React UI overlays will go here */}
		</div>
	);
}
