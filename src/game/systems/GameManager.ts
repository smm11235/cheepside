import { GameState, PASS_THRESHOLDS, TIME_CONFIG } from "@shared/types";
import { dictionary } from "./Dictionary";
import { generateLetterSet } from "./LetterGenerator";
import { getWordScore, isWordValid, calculateShotSuccess } from "./Scoring";

type GameEventCallback = (state: GameState, event: string, data?: unknown) => void;

class GameManager {
	private state: GameState;
	private listeners: GameEventCallback[] = [];
	private timerInterval: number | null = null;

	constructor() {
		this.state = this.createInitialState();
	}

	private createInitialState(): GameState {
		const letters = generateLetterSet();
		return {
			possession: 1,
			goals: 0,
			phase: "playing",
			currentPoints: 0,
			passIndex: 0,
			timeRemaining: TIME_CONFIG.startingTime,
			usedPentagons: [letters.center],
			currentWord: "",
			submittedWords: [],
			centerLetter: letters.center,
			surroundingLetters: letters.surrounding,
		};
	}

	subscribe(callback: GameEventCallback): () => void {
		this.listeners.push(callback);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== callback);
		};
	}

	private emit(event: string, data?: unknown): void {
		for (const listener of this.listeners) {
			listener(this.state, event, data);
		}
	}

	getState(): GameState {
		return { ...this.state };
	}

	async initialize(): Promise<void> {
		await dictionary.load();
		this.emit("initialized");
	}

	startMatch(): void {
		this.state = this.createInitialState();
		this.startTimer();
		this.emit("matchStart");
	}

	private startTimer(): void {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}
		this.timerInterval = window.setInterval(() => {
			if (this.state.phase !== "playing") return;

			this.state.timeRemaining -= 0.1;
			this.emit("tick");

			if (this.state.timeRemaining <= 0) {
				this.handleTimeout();
			}
		}, 100);
	}

	private stopTimer(): void {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
			this.timerInterval = null;
		}
	}

	addLetter(letter: string): void {
		if (this.state.phase !== "playing") return;
		this.state.currentWord += letter.toUpperCase();
		this.emit("letterAdded", letter);
	}

	removeLetter(): void {
		if (this.state.phase !== "playing") return;
		if (this.state.currentWord.length > 0) {
			this.state.currentWord = this.state.currentWord.slice(0, -1);
			this.emit("letterRemoved");
		}
	}

	clearWord(): void {
		if (this.state.phase !== "playing") return;
		this.state.currentWord = "";
		this.emit("wordCleared");
	}

	submitWord(): { success: boolean; reason?: string; score?: number } {
		if (this.state.phase !== "playing") {
			return { success: false, reason: "Not in playing phase" };
		}

		const word = this.state.currentWord.toUpperCase();

		// Check minimum length
		if (word.length < 3) {
			return { success: false, reason: "Word too short" };
		}

		// Check if already submitted this phase
		if (this.state.submittedWords.includes(word)) {
			return { success: false, reason: "Already used" };
		}

		// Check if uses valid letters
		if (!isWordValid(word, this.state.centerLetter, this.state.surroundingLetters)) {
			return { success: false, reason: "Invalid letters" };
		}

		// Check dictionary
		if (!dictionary.isValid(word)) {
			return { success: false, reason: "Not in dictionary" };
		}

		// Valid word!
		const score = getWordScore(word);
		this.state.currentPoints += score;
		this.state.submittedWords.push(word);
		this.state.currentWord = "";

		this.emit("wordSubmitted", { word, score, totalPoints: this.state.currentPoints });

		// Check if threshold reached
		this.checkThreshold();

		return { success: true, score };
	}

	private checkThreshold(): void {
		const threshold = PASS_THRESHOLDS[this.state.passIndex];
		if (this.state.currentPoints >= threshold) {
			this.emit("thresholdReached", {
				passIndex: this.state.passIndex,
				threshold,
				points: this.state.currentPoints,
			});
		}
	}

	canPass(): boolean {
		if (this.state.phase !== "playing") return false;
		const threshold = PASS_THRESHOLDS[this.state.passIndex];
		return this.state.currentPoints >= threshold;
	}

	executePass(): void {
		if (!this.canPass()) return;

		if (this.state.passIndex < 4) {
			// Regular pass
			this.state.passIndex++;
			this.state.timeRemaining = Math.min(
				this.state.timeRemaining + TIME_CONFIG.bonusPerPass,
				TIME_CONFIG.maxTime
			);
			this.state.submittedWords = [];
			this.state.currentWord = "";

			// Generate new letters, excluding used pentagons
			const newLetters = generateLetterSet(this.state.usedPentagons);
			this.state.centerLetter = newLetters.center;
			this.state.surroundingLetters = newLetters.surrounding;
			this.state.usedPentagons.push(newLetters.center);

			this.emit("passCompleted", { passIndex: this.state.passIndex });
		} else {
			// Shot!
			this.executeShot();
		}
	}

	private executeShot(): void {
		this.state.phase = "shot";
		this.stopTimer();

		const bonusPoints = this.state.currentPoints - 100;
		const result = calculateShotSuccess(this.state.timeRemaining, bonusPoints);

		this.emit("shotTaken", result);

		setTimeout(() => {
			if (result.success) {
				this.state.goals++;
				this.state.phase = "goal";
				this.emit("goalScored", { goals: this.state.goals });
			} else {
				this.state.phase = "miss";
				this.emit("shotMissed");
			}

			// Continue to next possession or end match
			setTimeout(() => this.nextPossession(), 2000);
		}, 1500);
	}

	private handleTimeout(): void {
		this.state.phase = "timeout";
		this.stopTimer();
		this.emit("timeout");

		setTimeout(() => this.nextPossession(), 2000);
	}

	private nextPossession(): void {
		if (this.state.possession >= 3) {
			this.endMatch();
			return;
		}

		this.state.possession++;
		this.state.phase = "playing";
		this.state.currentPoints = 0;
		this.state.passIndex = 0;
		this.state.timeRemaining = TIME_CONFIG.startingTime;
		this.state.submittedWords = [];
		this.state.currentWord = "";

		// Full reshuffle for new possession
		const newLetters = generateLetterSet();
		this.state.centerLetter = newLetters.center;
		this.state.surroundingLetters = newLetters.surrounding;
		this.state.usedPentagons = [newLetters.center];

		this.startTimer();
		this.emit("possessionStart", { possession: this.state.possession });
	}

	private endMatch(): void {
		this.state.phase = "matchEnd";
		this.stopTimer();
		this.emit("matchEnd", { goals: this.state.goals });
	}

	restartMatch(): void {
		this.stopTimer();
		this.startMatch();
	}

	destroy(): void {
		this.stopTimer();
		this.listeners = [];
	}
}

export const gameManager = new GameManager();
