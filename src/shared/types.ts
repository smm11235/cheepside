export interface LetterPanel {
	letter: string;
	isPentagon: boolean; // true = center (required), false = hexagon
	index: number;
}

export interface GameState {
	// Match state
	possession: number; // 1-3
	goals: number;
	phase: "playing" | "shot" | "goal" | "miss" | "timeout" | "matchEnd";

	// Current possession state
	currentPoints: number;
	passIndex: number; // 0-4 (0-3 = passes, 4 = shot)
	timeRemaining: number; // in seconds
	usedPentagons: string[]; // letters that have been center this possession

	// Word state
	currentWord: string;
	submittedWords: string[]; // words submitted this phase

	// Letter board
	centerLetter: string;
	surroundingLetters: string[];
}

export const PASS_THRESHOLDS = [5, 20, 40, 65, 100] as const;

export const FIBONACCI_SCORES: Record<number, number> = {
	3: 1,
	4: 2,
	5: 3,
	6: 5,
	7: 8,
	8: 13,
	9: 21,
	10: 34,
	11: 55,
	12: 89,
};

export const TIME_CONFIG = {
	startingTime: 20,
	bonusPerPass: 20,
	maxTime: 100,
} as const;
