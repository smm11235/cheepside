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
	// Center letter: always a common consonant (better for word formation)
	const availableForCenter = COMMON_CONSONANTS.filter(
		(c) => !excludeCenters.includes(c)
	);
	const center = availableForCenter.length > 0
		? pickRandom(availableForCenter)
		: pickRandom(COMMON_CONSONANTS);

	// Surrounding 5 letters:
	// - Always 2 vowels (guaranteed)
	// - 1-2 common consonants
	// - Rest random
	const surrounding: string[] = [];

	// Add exactly 2 vowels (guaranteed)
	const usedVowels: string[] = [];
	for (let i = 0; i < 2; i++) {
		let vowel = pickRandom(VOWELS);
		// Try to get different vowels
		let attempts = 0;
		while (usedVowels.includes(vowel) && attempts < 5) {
			vowel = pickRandom(VOWELS);
			attempts++;
		}
		usedVowels.push(vowel);
		surrounding.push(vowel);
	}

	// Add 1-2 common consonants (not the center letter)
	const commonCount = Math.random() < 0.5 ? 1 : 2;
	const availableCommon = COMMON_CONSONANTS.filter((c) => c !== center);
	const usedCommon: string[] = [];
	for (let i = 0; i < commonCount; i++) {
		let consonant = pickRandom(availableCommon);
		let attempts = 0;
		while (usedCommon.includes(consonant) && attempts < 5) {
			consonant = pickRandom(availableCommon);
			attempts++;
		}
		usedCommon.push(consonant);
		surrounding.push(consonant);
	}

	// Fill remaining slots with random letters
	const allLetters = [...VOWELS, ...COMMON_CONSONANTS, ...OTHER_CONSONANTS];
	while (surrounding.length < 5) {
		const letter = pickRandom(allLetters);
		// Avoid too many duplicates and avoid center letter
		const count = surrounding.filter((l) => l === letter).length;
		if (letter !== center && count < 2) {
			surrounding.push(letter);
		}
	}

	return { center, surrounding: shuffle(surrounding) };
}
