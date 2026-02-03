class DictionarySystem {
	private words: Set<string> = new Set();
	private loaded = false;
	private loadPromise: Promise<void> | null = null;

	async load(): Promise<void> {
		if (this.loaded) return;
		if (this.loadPromise) return this.loadPromise;

		this.loadPromise = fetch("/WordList.txt")
			.then((response) => response.text())
			.then((text) => {
				const lines = text.split("\n");
				for (const line of lines) {
					const word = line.trim().toUpperCase();
					if (word.length >= 3) {
						this.words.add(word);
					}
				}
				this.loaded = true;
			});

		return this.loadPromise;
	}

	isValid(word: string): boolean {
		return this.words.has(word.toUpperCase());
	}

	isLoaded(): boolean {
		return this.loaded;
	}

	getWordCount(): number {
		return this.words.size;
	}
}

export const dictionary = new DictionarySystem();
