// Seeded random number generator (Mulberry32)
function createSeededRandom(seed: number): () => number {
	return function () {
		let t = (seed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export interface LetterSet {
	center: string;
	surrounding: string[];
	seedWord: string;
	difficulty: string;
}

interface SeedWordEntry {
	seedWord: string;
	letters: string[];
	viableCentres: string[];
	centreDifficulty: Record<string, string>;
}

class LetterGeneratorSystem {
	private seedWords: SeedWordEntry[] = [];
	private loaded = false;
	private loadPromise: Promise<void> | null = null;

	async load(): Promise<void> {
		if (this.loaded) return;
		if (this.loadPromise) return this.loadPromise;

		this.loadPromise = fetch(`${import.meta.env.BASE_URL}SeedWordList.csv`)
			.then((response) => response.text())
			.then((text) => {
				const lines = text.split("\n");
				// Skip header
				for (let i = 1; i < lines.length; i++) {
					const line = lines[i].trim();
					if (!line) continue;

					const entry = this.parseCsvLine(line);
					if (entry) {
						this.seedWords.push(entry);
					}
				}
				this.loaded = true;
			});

		return this.loadPromise;
	}

	private parseCsvLine(line: string): SeedWordEntry | null {
		// CSV format: seed_word,letters,viable_centres,centre_difficulty,words_3,words_4,words_5
		// Need to handle JSON with commas inside quotes

		const parts: string[] = [];
		let current = "";
		let inQuotes = false;

		for (const char of line) {
			if (char === '"') {
				inQuotes = !inQuotes;
			} else if (char === "," && !inQuotes) {
				parts.push(current);
				current = "";
			} else {
				current += char;
			}
		}
		parts.push(current);

		if (parts.length < 4) return null;

		const seedWord = parts[0];
		const letters = parts[1].split(",").map((l) => l.trim());
		const viableCentres = parts[2].split(",").map((l) => l.trim());

		// Parse centre_difficulty JSON (it uses single quotes in some cases)
		let centreDifficulty: Record<string, string> = {};
		try {
			const diffJson = parts[3].replace(/'/g, '"');
			centreDifficulty = JSON.parse(diffJson);
		} catch {
			// Default all to Easy if parsing fails
			viableCentres.forEach((c) => (centreDifficulty[c] = "Easy"));
		}

		return { seedWord, letters, viableCentres, centreDifficulty };
	}

	isLoaded(): boolean {
		return this.loaded;
	}

	/**
	 * Generate all letter sets for a round (5 sets: 4 passes + 1 shot)
	 * Uses seeded random for reproducibility
	 */
	generateRoundSets(seed?: number): LetterSet[] {
		const actualSeed = seed ?? Date.now();
		const random = createSeededRandom(actualSeed);

		const sets: LetterSet[] = [];
		const usedLetterKeys = new Set<string>();

		for (let i = 0; i < 5; i++) {
			const set = this.generateSingleSet(random, usedLetterKeys);
			sets.push(set);

			// Track used letter combination to avoid repeats
			const key = this.getLetterSetKey(set);
			usedLetterKeys.add(key);
		}

		return sets;
	}

	private getLetterSetKey(set: LetterSet): string {
		const allLetters = [set.center, ...set.surrounding].sort();
		return allLetters.join(",");
	}

	private generateSingleSet(
		random: () => number,
		usedKeys: Set<string>
	): LetterSet {
		const maxAttempts = 100;

		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			// Pick a random seed word
			const entryIndex = Math.floor(random() * this.seedWords.length);
			const entry = this.seedWords[entryIndex];

			if (!entry || entry.viableCentres.length === 0) continue;

			// Pick a center letter with slight bias toward harder difficulties
			const center = this.pickCenter(entry, random);

			// Surrounding letters are all letters except the center
			const surrounding = entry.letters.filter((l) => l !== center);

			if (surrounding.length !== 5) continue;

			const set: LetterSet = {
				center,
				surrounding,
				seedWord: entry.seedWord,
				difficulty: entry.centreDifficulty[center] || "Easy",
			};

			// Check if this combination was already used
			const key = this.getLetterSetKey(set);
			if (!usedKeys.has(key)) {
				return set;
			}
		}

		// Fallback: return any valid set (shouldn't happen with 3400+ words)
		const entry = this.seedWords[Math.floor(random() * this.seedWords.length)];
		const center = entry.viableCentres[0];
		return {
			center,
			surrounding: entry.letters.filter((l) => l !== center),
			seedWord: entry.seedWord,
			difficulty: entry.centreDifficulty[center] || "Easy",
		};
	}

	private pickCenter(entry: SeedWordEntry, random: () => number): string {
		const { viableCentres, centreDifficulty } = entry;

		// Weight centers: Easy = 1, Medium = 2, Hard = 3
		// This gives harder centers a slightly higher chance
		const weights: { center: string; weight: number }[] = [];

		for (const center of viableCentres) {
			const diff = centreDifficulty[center] || "Easy";
			let weight = 1;
			if (diff === "Medium") weight = 1.5;
			if (diff === "Hard") weight = 2;
			weights.push({ center, weight });
		}

		const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
		let r = random() * totalWeight;

		for (const { center, weight } of weights) {
			r -= weight;
			if (r <= 0) return center;
		}

		return viableCentres[0];
	}
}

export const letterGenerator = new LetterGeneratorSystem();

// Legacy function for compatibility - generates a single set
export function generateLetterSet(_excludeCenters: string[] = []): LetterSet {
	if (!letterGenerator.isLoaded()) {
		// Fallback if not loaded yet
		return {
			center: "S",
			surrounding: ["A", "E", "R", "T", "N"],
			seedWord: "FALLBACK",
			difficulty: "Easy",
		};
	}

	const sets = letterGenerator.generateRoundSets();
	return sets[0];
}
