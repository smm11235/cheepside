import { useGameState } from "@ui/hooks/useGameState";
import { gameManager } from "@game/systems/GameManager";
import { colors, typography, spacing, layout } from "@shared/theme";

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
		zIndex: layout.zIndex.overlay,
	},
	title: {
		fontSize: "36px",
		fontWeight: typography.fontWeight.bold,
		fontFamily: typography.fontFamily.primary,
		color: colors.text.primary,
		marginBottom: spacing.lg,
	},
	goals: {
		fontSize: "72px",
		fontWeight: typography.fontWeight.bold,
		fontFamily: typography.fontFamily.primary,
		color: colors.accent,
		marginBottom: spacing.sm,
	},
	goalsLabel: {
		fontSize: typography.fontSize.xl,
		fontFamily: typography.fontFamily.primary,
		color: colors.text.secondary,
		marginBottom: spacing["2xl"],
	},
	button: {
		padding: `${spacing.lg} ${spacing["3xl"]}`,
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		fontFamily: typography.fontFamily.primary,
		background: colors.primary,
		color: colors.text.onPrimary,
		border: "none",
		borderRadius: layout.borderRadius.lg,
		cursor: "pointer",
	},
	phaseText: {
		fontSize: typography.fontSize["4xl"],
		fontWeight: typography.fontWeight.bold,
		fontFamily: typography.fontFamily.primary,
		color: colors.text.primary,
		textAlign: "center",
	},
	subText: {
		fontSize: typography.fontSize.lg,
		fontFamily: typography.fontFamily.primary,
		color: colors.text.secondary,
		marginTop: spacing.md,
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
				<div style={{ ...styles.phaseText, color: colors.accent }}>GOAL!</div>
			</div>
		);
	}

	if (state.phase === "miss") {
		return (
			<div style={styles.overlay}>
				<div style={{ ...styles.phaseText, color: colors.state.error }}>Saved!</div>
			</div>
		);
	}

	return null;
}
