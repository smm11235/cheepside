import { Scene, GameObjects } from "phaser";
import { gameManager } from "../systems/GameManager";

interface ButtonData {
	x: number;
	y: number;
	radius: number;
	index: number; // -1 for center, 0-4 for surrounding
	container: GameObjects.Container;
}

export class GameScene extends Scene {
	private buttons: ButtonData[] = [];
	private centerButton!: GameObjects.Container;
	private letterButtons: GameObjects.Container[] = [];

	// Pitch elements
	private pitchGraphics!: GameObjects.Graphics;
	private ballPositionMarker!: GameObjects.Arc;
	private ballBg!: GameObjects.Graphics;

	// Event unsubscribe
	private unsubscribe: (() => void) | null = null;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.createPitch();
		this.createBallInterface();
		this.setupInput();
		this.setupKeyboardInput();
		this.subscribeToGameEvents();

		// Handle resize
		this.scale.on("resize", this.handleResize, this);

		// Start the match
		gameManager.startMatch();
	}

	private setupInput(): void {
		// Use scene-level pointer input for reliable click detection
		this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
			const clickedButton = this.findButtonAtPosition(pointer.x, pointer.y);
			if (clickedButton) {
				this.handleButtonClick(clickedButton);
			}
		});
	}

	private findButtonAtPosition(x: number, y: number): ButtonData | null {
		for (const button of this.buttons) {
			const dx = x - button.x;
			const dy = y - button.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance <= button.radius) {
				return button;
			}
		}
		return null;
	}

	private handleButtonClick(button: ButtonData): void {
		const state = gameManager.getState();
		let letter: string;

		if (button.index === -1) {
			letter = state.centerLetter;
		} else {
			letter = state.surroundingLetters[button.index];
		}

		if (letter) {
			gameManager.addLetter(letter.toUpperCase());
			this.animateButtonPress(button.container);
		}
	}

	private handleResize(): void {
		this.pitchGraphics.clear();
		this.ballBg.clear();

		const { width, height } = this.scale;
		const pitchHeight = height * 0.3;

		this.pitchGraphics.fillStyle(0x2d8a3e, 1);
		this.pitchGraphics.fillRect(0, 0, width, pitchHeight);
		this.pitchGraphics.lineStyle(2, 0xffffff, 0.8);
		this.pitchGraphics.moveTo(0, pitchHeight / 2);
		this.pitchGraphics.lineTo(width, pitchHeight / 2);
		this.pitchGraphics.strokePath();
		this.pitchGraphics.strokeCircle(width / 2, pitchHeight / 2, 30);

		const goalWidth = 60;
		const goalHeight = 25;
		this.pitchGraphics.strokeRect(0, pitchHeight / 2 - goalHeight, goalWidth, goalHeight * 2);
		this.pitchGraphics.strokeRect(width - goalWidth, pitchHeight / 2 - goalHeight, goalWidth, goalHeight * 2);

		const state = gameManager.getState();
		const positions = [0.3, 0.45, 0.6, 0.75, 0.85];
		this.ballPositionMarker.setPosition(width * positions[state.passIndex], pitchHeight / 2);

		const interfaceHeight = height - pitchHeight;
		const centerY = pitchHeight + interfaceHeight * 0.4;
		const centerX = width / 2;

		this.ballBg.fillStyle(0x1a1a2e, 1);
		this.ballBg.fillRect(0, pitchHeight, width, interfaceHeight);

		const ballRadius = Math.min(width, interfaceHeight) * 0.38;
		this.ballBg.lineStyle(3, 0x444466, 1);
		this.ballBg.strokeCircle(centerX, centerY, ballRadius);

		// Update button positions
		const centerSize = 55;
		this.centerButton.setPosition(centerX, centerY);
		this.buttons[0] = { x: centerX, y: centerY, radius: centerSize, index: -1, container: this.centerButton };

		const hexRadius = ballRadius * 0.55;
		const hexSize = 48;
		for (let i = 0; i < 5; i++) {
			const angle = (i * 72 - 90) * (Math.PI / 180);
			const x = centerX + Math.cos(angle) * hexRadius;
			const y = centerY + Math.sin(angle) * hexRadius;
			this.letterButtons[i].setPosition(x, y);
			this.buttons[i + 1] = { x, y, radius: hexSize, index: i, container: this.letterButtons[i] };
		}
	}

	private createPitch(): void {
		const { width, height } = this.scale;
		const pitchHeight = height * 0.3;

		this.pitchGraphics = this.add.graphics();

		this.pitchGraphics.fillStyle(0x2d8a3e, 1);
		this.pitchGraphics.fillRect(0, 0, width, pitchHeight);
		this.pitchGraphics.lineStyle(2, 0xffffff, 0.8);
		this.pitchGraphics.moveTo(0, pitchHeight / 2);
		this.pitchGraphics.lineTo(width, pitchHeight / 2);
		this.pitchGraphics.strokePath();
		this.pitchGraphics.strokeCircle(width / 2, pitchHeight / 2, 30);

		const goalWidth = 60;
		const goalHeight = 25;
		this.pitchGraphics.strokeRect(0, pitchHeight / 2 - goalHeight, goalWidth, goalHeight * 2);
		this.pitchGraphics.strokeRect(width - goalWidth, pitchHeight / 2 - goalHeight, goalWidth, goalHeight * 2);

		this.ballPositionMarker = this.add.circle(width * 0.3, pitchHeight / 2, 8, 0xffffff);
		this.ballPositionMarker.setStrokeStyle(2, 0x000000);
	}

	private createBallInterface(): void {
		const { width, height } = this.scale;
		const pitchHeight = height * 0.3;
		const interfaceHeight = height - pitchHeight;
		const centerY = pitchHeight + interfaceHeight * 0.4;
		const centerX = width / 2;

		this.ballBg = this.add.graphics();
		this.ballBg.fillStyle(0x1a1a2e, 1);
		this.ballBg.fillRect(0, pitchHeight, width, interfaceHeight);

		const ballRadius = Math.min(width, interfaceHeight) * 0.38;
		this.ballBg.lineStyle(3, 0x444466, 1);
		this.ballBg.strokeCircle(centerX, centerY, ballRadius);

		// Create center pentagon
		const centerSize = 55;
		this.centerButton = this.createLetterButton(centerX, centerY, true);
		this.buttons.push({ x: centerX, y: centerY, radius: centerSize, index: -1, container: this.centerButton });

		// Create surrounding hexagons
		const hexRadius = ballRadius * 0.55;
		const hexSize = 48;
		for (let i = 0; i < 5; i++) {
			const angle = (i * 72 - 90) * (Math.PI / 180);
			const x = centerX + Math.cos(angle) * hexRadius;
			const y = centerY + Math.sin(angle) * hexRadius;

			const button = this.createLetterButton(x, y, false);
			this.letterButtons.push(button);
			this.buttons.push({ x, y, radius: hexSize, index: i, container: button });
		}

		this.updateLetterDisplay();
	}

	private createLetterButton(x: number, y: number, isCenter: boolean): GameObjects.Container {
		const container = this.add.container(x, y);
		const size = isCenter ? 55 : 48;
		const sides = isCenter ? 5 : 6;

		const graphics = this.add.graphics();
		const points = this.getPolygonPoints(0, 0, size, sides);

		graphics.fillStyle(isCenter ? 0x3a3a5a : 0x2a2a4a, 1);
		graphics.lineStyle(2, isCenter ? 0x6a6a9a : 0x5a5a8a, 1);
		graphics.beginPath();
		graphics.moveTo(points[0].x, points[0].y);
		for (let i = 1; i < points.length; i++) {
			graphics.lineTo(points[i].x, points[i].y);
		}
		graphics.closePath();
		graphics.fillPath();
		graphics.strokePath();

		const text = this.add.text(0, 0, "", {
			fontSize: isCenter ? "32px" : "28px",
			fontFamily: "Arial, sans-serif",
			color: "#ffffff",
			fontStyle: "bold",
		});
		text.setOrigin(0.5);

		container.add([graphics, text]);
		container.setData("text", text);

		return container;
	}

	private setupKeyboardInput(): void {
		const getAvailableLetters = (): Set<string> => {
			const state = gameManager.getState();
			const letters = new Set<string>();
			letters.add(state.centerLetter.toUpperCase());
			state.surroundingLetters.forEach((l) => letters.add(l.toUpperCase()));
			return letters;
		};

		this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
			const key = event.key.toUpperCase();

			if (key.length === 1 && key >= "A" && key <= "Z") {
				const available = getAvailableLetters();
				if (available.has(key)) {
					gameManager.addLetter(key);
					this.flashKeyPress(key);
				}
				return;
			}

			if (event.key === "Backspace" || event.key === "Delete") {
				gameManager.removeLetter();
				return;
			}

			if (event.key === "Enter") {
				gameManager.submitWord();
				return;
			}

			if (event.key === " ") {
				event.preventDefault();
				if (gameManager.canPass()) {
					gameManager.executePass();
				}
				return;
			}

			if (event.key === "Escape") {
				gameManager.clearWord();
				return;
			}
		});
	}

	private flashKeyPress(letter: string): void {
		const state = gameManager.getState();

		if (state.centerLetter.toUpperCase() === letter) {
			this.animateButtonPress(this.centerButton);
			return;
		}

		const index = state.surroundingLetters.findIndex(
			(l) => l.toUpperCase() === letter
		);
		if (index >= 0) {
			this.animateButtonPress(this.letterButtons[index]);
		}
	}

	private getPolygonPoints(
		cx: number,
		cy: number,
		radius: number,
		sides: number
	): { x: number; y: number }[] {
		const points: { x: number; y: number }[] = [];
		const angleOffset = -Math.PI / 2;

		for (let i = 0; i < sides; i++) {
			const angle = angleOffset + (i * 2 * Math.PI) / sides;
			points.push({
				x: cx + radius * Math.cos(angle),
				y: cy + radius * Math.sin(angle),
			});
		}

		return points;
	}

	private updateLetterDisplay(): void {
		const state = gameManager.getState();

		const centerText = this.centerButton.getData("text") as GameObjects.Text;
		centerText.setText(state.centerLetter.toUpperCase());

		state.surroundingLetters.forEach((letter, i) => {
			const button = this.letterButtons[i];
			const text = button.getData("text") as GameObjects.Text;
			text.setText(letter.toUpperCase());
		});
	}

	private animateButtonPress(button: GameObjects.Container): void {
		this.tweens.add({
			targets: button,
			scaleX: 0.9,
			scaleY: 0.9,
			duration: 50,
			yoyo: true,
			ease: "Power2",
		});
	}

	private subscribeToGameEvents(): void {
		this.unsubscribe = gameManager.subscribe((state, event, _data) => {
			switch (event) {
				case "passCompleted":
				case "possessionStart":
				case "matchStart":
					this.updateLetterDisplay();
					this.updateBallPosition(state.passIndex);
					break;

				case "wordSubmitted":
					this.flashWordSuccess();
					break;

				case "goalScored":
					this.showGoalCelebration();
					break;

				case "shotMissed":
					this.showMissEffect();
					break;

				case "timeout":
					this.showTimeoutEffect();
					break;
			}
		});
	}

	private updateBallPosition(passIndex: number): void {
		const { width, height } = this.scale;
		const pitchHeight = height * 0.3;

		const positions = [0.3, 0.45, 0.6, 0.75, 0.85];
		const targetX = width * positions[passIndex];

		this.tweens.add({
			targets: this.ballPositionMarker,
			x: targetX,
			y: pitchHeight / 2,
			duration: 300,
			ease: "Power2",
		});
	}

	private flashWordSuccess(): void {
		this.cameras.main.flash(100, 100, 200, 100, true);
	}

	private showGoalCelebration(): void {
		const { width, height } = this.scale;
		const pitchHeight = height * 0.3;

		const goalText = this.add.text(width / 2, pitchHeight / 2, "GOAL!", {
			fontSize: "48px",
			fontFamily: "Arial, sans-serif",
			color: "#ffff00",
			fontStyle: "bold",
			stroke: "#000000",
			strokeThickness: 4,
		});
		goalText.setOrigin(0.5);

		this.tweens.add({
			targets: goalText,
			scaleX: 1.5,
			scaleY: 1.5,
			alpha: 0,
			duration: 1500,
			ease: "Power2",
			onComplete: () => goalText.destroy(),
		});
	}

	private showMissEffect(): void {
		const { width, height } = this.scale;
		const pitchHeight = height * 0.3;

		const missText = this.add.text(width / 2, pitchHeight / 2, "SAVED!", {
			fontSize: "36px",
			fontFamily: "Arial, sans-serif",
			color: "#ff6666",
			fontStyle: "bold",
			stroke: "#000000",
			strokeThickness: 3,
		});
		missText.setOrigin(0.5);

		this.tweens.add({
			targets: missText,
			alpha: 0,
			duration: 1500,
			onComplete: () => missText.destroy(),
		});
	}

	private showTimeoutEffect(): void {
		this.cameras.main.shake(200, 0.01);
	}

	shutdown(): void {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
		this.scale.off("resize", this.handleResize, this);
	}
}
