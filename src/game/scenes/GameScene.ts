import { Scene, GameObjects } from "phaser";
import { gameManager } from "../systems/GameManager";
import {
	colors,
	layout,
	typography,
	hexToNumber,
	calculateFootballGeometry,
} from "@shared/theme";

interface ButtonData {
	polygon: { x: number; y: number }[];
	index: number; // -1 for center pentagon, 0-4 for surrounding hexagons
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

	// Football geometry cache
	private footballGeometry!: ReturnType<typeof calculateFootballGeometry>;
	private footballScale = 1;
	private footballCenterX = 0;
	private footballCenterY = 0;

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
		// Check if point is inside any button polygon
		for (const button of this.buttons) {
			if (this.isPointInPolygon(x, y, button.polygon)) {
				return button;
			}
		}
		return null;
	}

	private isPointInPolygon(
		x: number,
		y: number,
		polygon: { x: number; y: number }[]
	): boolean {
		// Ray casting algorithm for point-in-polygon test
		let inside = false;
		for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
			const xi = polygon[i].x,
				yi = polygon[i].y;
			const xj = polygon[j].x,
				yj = polygon[j].y;

			if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
				inside = !inside;
			}
		}
		return inside;
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
		const pitchHeight = height * layout.pitch.heightRatio;

		// Redraw pitch
		this.drawPitch(width, pitchHeight);

		// Update ball position
		const state = gameManager.getState();
		const positions = [0.3, 0.45, 0.6, 0.75, 0.85];
		this.ballPositionMarker.setPosition(
			width * positions[state.passIndex],
			pitchHeight / 2
		);

		// Recalculate football interface layout
		this.updateFootballLayout(width, height, pitchHeight);
	}

	private drawPitch(width: number, pitchHeight: number): void {
		// Background
		this.pitchGraphics.fillStyle(hexToNumber(colors.surface.pitch), 1);
		this.pitchGraphics.fillRect(0, 0, width, pitchHeight);

		// Center line
		this.pitchGraphics.lineStyle(
			2,
			hexToNumber(colors.pitch.lines),
			colors.pitch.linesOpacity
		);
		this.pitchGraphics.moveTo(0, pitchHeight / 2);
		this.pitchGraphics.lineTo(width, pitchHeight / 2);
		this.pitchGraphics.strokePath();

		// Center circle
		this.pitchGraphics.strokeCircle(width / 2, pitchHeight / 2, 30);

		// Goals
		const goalWidth = 60;
		const goalHeight = 25;
		this.pitchGraphics.strokeRect(
			0,
			pitchHeight / 2 - goalHeight,
			goalWidth,
			goalHeight * 2
		);
		this.pitchGraphics.strokeRect(
			width - goalWidth,
			pitchHeight / 2 - goalHeight,
			goalWidth,
			goalHeight * 2
		);
	}

	private createPitch(): void {
		const { width, height } = this.scale;
		const pitchHeight = height * layout.pitch.heightRatio;

		this.pitchGraphics = this.add.graphics();
		this.drawPitch(width, pitchHeight);

		// Ball position marker
		this.ballPositionMarker = this.add.circle(
			width * 0.3,
			pitchHeight / 2,
			8,
			hexToNumber(colors.pitch.ball)
		);
		this.ballPositionMarker.setStrokeStyle(
			2,
			hexToNumber(colors.pitch.ballBorder)
		);
	}

	private createBallInterface(): void {
		const { width, height } = this.scale;
		const pitchHeight = height * layout.pitch.heightRatio;

		this.ballBg = this.add.graphics();

		// Calculate layout and draw
		this.updateFootballLayout(width, height, pitchHeight);

		this.updateLetterDisplay();
	}

	private updateFootballLayout(
		width: number,
		height: number,
		pitchHeight: number
	): void {
		// Clear existing buttons
		this.buttons = [];
		this.centerButton?.destroy();
		this.letterButtons.forEach((b) => b.destroy());
		this.letterButtons = [];

		// Calculate available space for football
		const interfaceHeight = height - pitchHeight;
		// Account for bottom controls area (approximately 140px for word display + buttons)
		const controlsHeight = 140;
		const availableHeight = interfaceHeight - controlsHeight;

		// Center the football in the available space
		this.footballCenterX = width / 2;
		this.footballCenterY = pitchHeight + availableHeight / 2;

		// Calculate scale based on available space
		// The outer radius of the football should fit within the available area
		const maxRadius = Math.min(width * 0.45, availableHeight * 0.45);
		this.footballScale = maxRadius / layout.ball.outerRadius;

		// Calculate geometry at this scale
		this.footballGeometry = calculateFootballGeometry(this.footballScale);

		// Draw background
		this.ballBg.clear();
		this.ballBg.fillStyle(hexToNumber(colors.surface.background), 1);
		this.ballBg.fillRect(0, pitchHeight, width, interfaceHeight);

		// Draw decorative ball outline
		const ballRadius = layout.ball.outerRadius * this.footballScale * 1.15;
		this.ballBg.lineStyle(3, hexToNumber(colors.football.outline), 1);
		this.ballBg.strokeCircle(
			this.footballCenterX,
			this.footballCenterY,
			ballRadius
		);

		// Create center pentagon
		this.centerButton = this.createPentagonButton();
		const pentagonPolygon = this.footballGeometry.pentagonVertices.map((v) => ({
			x: v.x + this.footballCenterX,
			y: v.y + this.footballCenterY,
		}));
		this.buttons.push({
			polygon: pentagonPolygon,
			index: -1,
			container: this.centerButton,
		});

		// Create surrounding hexagons
		for (let i = 0; i < 5; i++) {
			const button = this.createHexagonButton(i);
			this.letterButtons.push(button);

			const hexPolygon = this.footballGeometry.hexagonVertices[i].map((v) => ({
				x: v.x + this.footballCenterX,
				y: v.y + this.footballCenterY,
			}));
			this.buttons.push({
				polygon: hexPolygon,
				index: i,
				container: button,
			});
		}
	}

	private createPentagonButton(): GameObjects.Container {
		const container = this.add.container(
			this.footballCenterX,
			this.footballCenterY
		);
		const graphics = this.add.graphics();

		// Draw pentagon using calculated vertices
		const vertices = this.footballGeometry.pentagonVertices;

		graphics.fillStyle(hexToNumber(colors.football.pentagon), 1);
		graphics.lineStyle(2, hexToNumber(colors.football.pentagonBorder), 1);
		graphics.beginPath();
		graphics.moveTo(vertices[0].x, vertices[0].y);
		for (let i = 1; i < vertices.length; i++) {
			graphics.lineTo(vertices[i].x, vertices[i].y);
		}
		graphics.closePath();
		graphics.fillPath();
		graphics.strokePath();

		// Text label
		const text = this.add.text(0, 0, "", {
			fontSize: `${Math.round(32 * this.footballScale)}px`,
			fontFamily: typography.fontFamily.primary,
			color: colors.text.onPentagon,
			fontStyle: "bold",
		});
		text.setOrigin(0.5);

		container.add([graphics, text]);
		container.setData("text", text);

		return container;
	}

	private createHexagonButton(index: number): GameObjects.Container {
		// Calculate hexagon center position for the container
		const hexVertices = this.footballGeometry.hexagonVertices[index];
		const centerX =
			hexVertices.reduce((sum, v) => sum + v.x, 0) / hexVertices.length;
		const centerY =
			hexVertices.reduce((sum, v) => sum + v.y, 0) / hexVertices.length;

		const container = this.add.container(
			this.footballCenterX + centerX,
			this.footballCenterY + centerY
		);
		const graphics = this.add.graphics();

		// Draw hexagon using calculated vertices (offset by container center)
		graphics.fillStyle(hexToNumber(colors.football.hexagon), 1);
		graphics.lineStyle(2, hexToNumber(colors.football.hexagonBorder), 1);
		graphics.beginPath();
		graphics.moveTo(hexVertices[0].x - centerX, hexVertices[0].y - centerY);
		for (let i = 1; i < hexVertices.length; i++) {
			graphics.lineTo(hexVertices[i].x - centerX, hexVertices[i].y - centerY);
		}
		graphics.closePath();
		graphics.fillPath();
		graphics.strokePath();

		// Text label - position at visual center of the hexagon
		// The visual center is slightly toward the pentagon edge
		const textOffsetX = -centerX * 0.15;
		const textOffsetY = -centerY * 0.15;
		const text = this.add.text(textOffsetX, textOffsetY, "", {
			fontSize: `${Math.round(28 * this.footballScale)}px`,
			fontFamily: typography.fontFamily.primary,
			color: colors.text.onHexagon,
			fontStyle: "bold",
		});
		text.setOrigin(0.5);

		container.add([graphics, text]);
		container.setData("text", text);

		return container;
	}

	private setupKeyboardInput(): void {
		const getAvailableTiles = (): Set<string> => {
			const state = gameManager.getState();
			const tiles = new Set<string>();
			tiles.add(state.centerLetter.toUpperCase());
			state.surroundingLetters.forEach((l) => tiles.add(l.toUpperCase()));
			return tiles;
		};

		this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
			const key = event.key.toUpperCase();

			if (key.length === 1 && key >= "A" && key <= "Z") {
				const available = getAvailableTiles();

				// Handle Q key specially - if we have QU tile, add QU
				if (key === "Q" && available.has("QU")) {
					gameManager.addLetter("QU");
					this.flashKeyPress("QU");
					return;
				}

				// For other letters, check if available
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

	private flashKeyPress(tile: string): void {
		const state = gameManager.getState();
		const upperTile = tile.toUpperCase();

		if (state.centerLetter.toUpperCase() === upperTile) {
			this.animateButtonPress(this.centerButton);
			return;
		}

		const index = state.surroundingLetters.findIndex(
			(l) => l.toUpperCase() === upperTile
		);
		if (index >= 0) {
			this.animateButtonPress(this.letterButtons[index]);
		}
	}

	private updateLetterDisplay(): void {
		const state = gameManager.getState();

		const centerText = this.centerButton?.getData("text") as GameObjects.Text;
		if (centerText) {
			centerText.setText(state.centerLetter.toUpperCase());
		}

		state.surroundingLetters.forEach((letter, i) => {
			const button = this.letterButtons[i];
			if (button) {
				const text = button.getData("text") as GameObjects.Text;
				if (text) {
					text.setText(letter.toUpperCase());
				}
			}
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
		const pitchHeight = height * layout.pitch.heightRatio;

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
		const pitchHeight = height * layout.pitch.heightRatio;

		const goalText = this.add.text(width / 2, pitchHeight / 2, "GOAL!", {
			fontSize: typography.fontSize["4xl"],
			fontFamily: typography.fontFamily.primary,
			color: colors.accent,
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
		const pitchHeight = height * layout.pitch.heightRatio;

		const missText = this.add.text(width / 2, pitchHeight / 2, "SAVED!", {
			fontSize: "36px",
			fontFamily: typography.fontFamily.primary,
			color: colors.state.error,
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
