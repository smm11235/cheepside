import { Scene } from "phaser";
import { gameManager } from "../systems/GameManager";

export class BootScene extends Scene {
	constructor() {
		super({ key: "BootScene" });
	}

	preload(): void {
		// Show loading text
		const { width, height } = this.scale;
		const loadingText = this.add.text(width / 2, height / 2, "Loading...", {
			fontSize: "24px",
			fontFamily: "Arial, sans-serif",
			color: "#ffffff",
		});
		loadingText.setOrigin(0.5);
	}

	async create(): Promise<void> {
		// Initialize game manager (loads dictionary)
		await gameManager.initialize();

		// Transition to game scene
		this.scene.start("GameScene");
	}
}
