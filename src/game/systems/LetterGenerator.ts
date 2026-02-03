const VOWELS = ["A", "E", "I", "O", "U"];
const COMMON_CONSONANTS = ["R", "T", "P", "L", "N", "S", "D", "H", "B", "C"];
const OTHER_CONSONANTS = ["F", "G", "J", "K", "M", "Q", "V", "W", "X", "Y", "Z"];

function pickRandom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
	const result = [...arr];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

export interface LetterSet {
	center: string;
	surrounding: string[];
}

export function generateLetterSet(excludeCenters: string[] = []): LetterSet {
	const usedLetters = new Set<string>();

	// Center letter: always a common consonant (better for word formation)
	const availableForCenter = COMMON_CONSONANTS.filter(
		(c) => !excludeCenters.includes(c)
	);
	const center = availableForCenter.length > 0
		? pickRandom(availableForCenter)
		: pickRandom(COMMON_CONSONANTS);

	usedLetters.add(center);

	// Surrounding 5 letters - all unique, no duplicates
	// - Always 2 vowels (guaranteed)
	// - 1-2 common consonants
	// - Rest random
	const surrounding: string[] = [];

	// Add exactly 2 unique vowels
	const availableVowels = VOWELS.filter((v) => !usedLetters.has(v));
	for (let i = 0; i < 2 && availableVowels.length > 0; i++) {
		const idx = Math.floor(Math.random() * availableVowels.length);
		const vowel = availableVowels.splice(idx, 1)[0];
		surrounding.push(vowel);
		usedLetters.add(vowel);
	}

	// Add 1-2 common consonants (not already used)
	const commonCount = Math.random() < 0.5 ? 1 : 2;
	const availableCommon = COMMON_CONSONANTS.filter((c) => !usedLetters.has(c));
	for (let i = 0; i < commonCount && availableCommon.length > 0; i++) {
		const idx = Math.floor(Math.random() * availableCommon.length);
		const consonant = availableCommon.splice(idx, 1)[0];
		surrounding.push(consonant);
		usedLetters.add(consonant);
	}

	// Fill remaining slots with unique random letters
	const allLetters = [...VOWELS, ...COMMON_CONSONANTS, ...OTHER_CONSONANTS];
	const availableAll = allLetters.filter((l) => !usedLetters.has(l));
	while (surrounding.length < 5 && availableAll.length > 0) {
		const idx = Math.floor(Math.random() * availableAll.length);
		const letter = availableAll.splice(idx, 1)[0];
		surrounding.push(letter);
		usedLetters.add(letter);
	}

	return { center, surrounding: shuffle(surrounding) };
}
