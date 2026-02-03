import { Types } from "phaser";
import { BootScene } from "./scenes/BootScene";
import { GameScene } from "./scenes/GameScene";

export const gameConfig: Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: "game-container",
	backgroundColor: "#1a1a2e",
	scale: {
		mode: Phaser.Scale.RESIZE,
		width: "100%",
		height: "100%",
	},
	scene: [BootScene, GameScene],
};
