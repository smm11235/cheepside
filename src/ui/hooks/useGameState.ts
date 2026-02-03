import { useState, useEffect } from "react";
import { GameState } from "@shared/types";
import { gameManager } from "@game/systems/GameManager";

export function useGameState(): GameState {
	const [state, setState] = useState<GameState>(gameManager.getState());

	useEffect(() => {
		const unsubscribe = gameManager.subscribe((newState) => {
			setState({ ...newState });
		});

		return () => unsubscribe();
	}, []);

	return state;
}
