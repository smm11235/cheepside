import { useGameState } from "@ui/hooks/useGameState";
import { gameManager } from "@game/systems/GameManager";

const styles: Record<string, React.CSSProperties> = {
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		background: "rgba(0, 0, 0, 0.85)",
		zIndex: 200,
	},
	title: {
		fontSize: "36px",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		color: "#fff",
		marginBottom: "16px",
	},
	goals: {
		fontSize: "72px",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		color: "#ffd700",
		marginBottom: "8px",
	},
	goalsLabel: {
		fontSize: "24px",
		fontFamily: "Arial, sans-serif",
		color: "#aaa",
		marginBottom: "32px",
	},
	button: {
		padding: "16px 48px",
		fontSize: "20px",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		background: "#4ade80",
		color: "#000",
		border: "none",
		borderRadius: "12px",
		cursor: "pointer",
	},
	phaseText: {
		fontSize: "48px",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		color: "#fff",
		textAlign: "center",
	},
	subText: {
		fontSize: "20px",
		fontFamily: "Arial, sans-serif",
		color: "#aaa",
		marginTop: "12px",
	},
};

export function GameOverlay() {
	const state = useGameState();

	if (state.phase === "playing") {
		return null;
	}

	if (state.phase === "matchEnd") {
		return (
			<div style={styles.overlay}>
				<div style={styles.title}>Full Time!</div>
				<div style={styles.goals}>{state.goals}</div>
				<div style={styles.goalsLabel}>
					{state.goals === 1 ? "Goal" : "Goals"} Scored
				</div>
				<button
					style={styles.button}
					onClick={() => gameManager.restartMatch()}
				>
					Play Again
				</button>
			</div>
		);
	}

	if (state.phase === "timeout") {
		return (
			<div style={styles.overlay}>
				<div style={styles.phaseText}>Time's Up!</div>
				<div style={styles.subText}>Possession lost...</div>
			</div>
		);
	}

	if (state.phase === "shot") {
		return (
			<div style={styles.overlay}>
				<div style={styles.phaseText}>Taking the shot...</div>
			</div>
		);
	}

	if (state.phase === "goal") {
		return (
			<div style={styles.overlay}>
				<div style={{ ...styles.phaseText, color: "#ffd700" }}>GOAL!</div>
			</div>
		);
	}

	if (state.phase === "miss") {
		return (
			<div style={styles.overlay}>
				<div style={{ ...styles.phaseText, color: "#f87171" }}>Saved!</div>
			</div>
		);
	}

	return null;
}
