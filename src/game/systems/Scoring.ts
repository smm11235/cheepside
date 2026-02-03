import { FIBONACCI_SCORES } from "@shared/types";

export function getWordScore(word: string, centerTile: string): number {
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

	// Double points if word contains center tile
	const includesCenter = wordContainsTile(word, centerTile);
	return includesCenter ? baseScore * 2 : baseScore;
}

function wordContainsTile(word: string, tile: string): boolean {
	const upperWord = word.toUpperCase();
	const upperTile = tile.toUpperCase();

	if (upperTile === "QU") {
		return upperWord.includes("QU");
	}
	return upperWord.includes(upperTile);
}

/**
 * Check if a word can be formed using the available tiles.
 * Tiles can be reused unlimited times.
 * Handles QU as a single tile.
 */
export function isWordValidWithTiles(word: string, tiles: string[]): boolean {
	const upperWord = word.toUpperCase();

	// Build set of available single letters and check for QU tile
	const availableLetters = new Set<string>();
	let hasQuTile = false;

	for (const tile of tiles) {
		const upperTile = tile.toUpperCase();
		if (upperTile === "QU") {
			hasQuTile = true;
		} else {
			availableLetters.add(upperTile);
		}
	}

	// Check each character in the word
	let i = 0;
	while (i < upperWord.length) {
		// Check for QU digraph first
		if (hasQuTile && i < upperWord.length - 1 && upperWord.slice(i, i + 2) === "QU") {
			i += 2;
			continue;
		}

		// Check single letter
		const char = upperWord[i];

		// Q without U tile - check if we have Q as a single letter (shouldn't happen normally)
		if (char === "Q" && !availableLetters.has("Q")) {
			// If we have QU tile and next char is U, it should have been caught above
			// Otherwise Q alone is invalid unless we have a Q tile
			return false;
		}

		if (!availableLetters.has(char)) {
			return false;
		}

		i++;
	}

	return true;
}

export function calculateShotSuccess(
	timeRemaining: number,
	bonusPoints: number
): { success: boolean; accuracy: number; power: number } {
	const accuracy = Math.min(100, timeRemaining * 2);
	const power = bonusPoints > 0 ? Math.min(100, Math.log2(bonusPoints + 1) * 15) : 0;
	const successChance = 0.4 + (accuracy / 100) * 0.4 + (power / 100) * 0.2;
	const success = Math.random() < successChance;

	return { success, accuracy, power };
}

// Legacy export for compatibility
export function isWordValid(
	word: string,
	_centerLetter: string,
	availableLetters: string[],
	centerLetter: string
): boolean {
	const allTiles = [centerLetter, ...availableLetters];
	return isWordValidWithTiles(word, allTiles);
}
