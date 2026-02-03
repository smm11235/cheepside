import { FIBONACCI_SCORES } from "@shared/types";

export function getWordScore(word: string, centerLetter: string): number {
	const length = word.length;
	if (length < 3) return 0;

	let baseScore: number;
	if (length in FIBONACCI_SCORES) {
		baseScore = FIBONACCI_SCORES[length];
	} else {
		// For words longer than 12 letters, continue Fibonacci
		let a = 55,
			b = 89;
		for (let i = 12; i < length; i++) {
			const temp = a + b;
			a = b;
			b = temp;
		}
		baseScore = b;
	}

	// Double points if word contains center letter
	const includesCenter = word.toUpperCase().includes(centerLetter.toUpperCase());
	return includesCenter ? baseScore * 2 : baseScore;
}

export function isWordValid(
	word: string,
	_centerLetter: string,
	availableLetters: string[],
	centerLetter: string
): boolean {
	const upper = word.toUpperCase();

	// Must be at least 3 letters
	if (upper.length < 3) return false;

	// All letters must be from available set (center + surrounding)
	// Center letter is NO LONGER required
	const available = new Set([
		centerLetter.toUpperCase(),
		...availableLetters.map((l) => l.toUpperCase()),
	]);
	for (const letter of upper) {
		if (!available.has(letter)) return false;
	}

	return true;
}

export function calculateShotSuccess(
	timeRemaining: number,
	bonusPoints: number
): { success: boolean; accuracy: number; power: number } {
	// Accuracy based on time remaining (0-100 scale)
	// More time = better accuracy
	const accuracy = Math.min(100, timeRemaining * 2);

	// Power based on bonus points beyond 100 (logarithmic)
	// More points = more power, but diminishing returns
	const power = bonusPoints > 0 ? Math.min(100, Math.log2(bonusPoints + 1) * 15) : 0;

	// Combined score for success chance
	// Base 40% chance, +accuracy contributes up to 40%, +power contributes up to 20%
	const successChance = 0.4 + (accuracy / 100) * 0.4 + (power / 100) * 0.2;

	const success = Math.random() < successChance;

	return { success, accuracy, power };
}
