import { useGameState } from "@ui/hooks/useGameState";
import { PASS_THRESHOLDS } from "@shared/types";
import { colors, typography, spacing, layout } from "@shared/theme";

const styles: Record<string, React.CSSProperties> = {
	container: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		padding: `${spacing.sm} ${spacing.md}`,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		background: colors.surface.hudBackground,
		color: colors.text.primary,
		fontFamily: typography.fontFamily.primary,
		fontSize: typography.fontSize.sm,
		zIndex: layout.zIndex.hud,
		pointerEvents: "none",
	},
	pauseButton: {
		background: "transparent",
		border: "none",
		color: colors.text.primary,
		fontSize: typography.fontSize.xl,
		cursor: "pointer",
		padding: `${spacing.xs} ${spacing.sm}`,
		pointerEvents: "auto",
	},
	section: {
		display: "flex",
		alignItems: "center",
		gap: spacing.lg,
	},
	stat: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	label: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
		textTransform: "uppercase",
	},
	value: {
		fontSize: "18px",
		fontWeight: typography.fontWeight.bold,
	},
	goals: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.accent,
	},
	timer: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
	},
	timerLow: {
		color: colors.state.error,
	},
	progress: {
		display: "flex",
		gap: spacing.xs,
		alignItems: "center",
	},
	progressDot: {
		width: "8px",
		height: "8px",
		borderRadius: "50%",
		background: colors.progress.inactive,
	},
	progressDotActive: {
		background: colors.progress.active,
	},
	progressDotCurrent: {
		background: colors.progress.current,
		boxShadow: `0 0 6px ${colors.progress.current}`,
	},
};

interface HUDProps {
	onPause: () => void;
}

export function HUD({ onPause }: HUDProps) {
	const state = useGameState();
	const threshold = PASS_THRESHOLDS[state.passIndex];
	const isTimerLow = state.timeRemaining <= 5;

	const passLabels = ["Pass 1", "Pass 2", "Pass 3", "Pass 4", "Shot"];

	return (
		<div style={styles.container}>
			<div style={styles.section}>
				<div style={styles.stat}>
					<span style={styles.label}>Possession</span>
					<span style={styles.value}>{state.possession}/3</span>
				</div>
				<div style={styles.stat}>
					<span style={styles.label}>Goals</span>
					<span style={styles.goals}>{state.goals}</span>
				</div>
			</div>

			<div style={styles.section}>
				<div style={styles.stat}>
					<span style={styles.label}>{passLabels[state.passIndex]}</span>
					<span style={styles.value}>
						{state.currentPoints} / {threshold}
					</span>
				</div>
				<div style={styles.progress}>
					{PASS_THRESHOLDS.map((_, i) => (
						<div
							key={i}
							style={{
								...styles.progressDot,
								...(i < state.passIndex ? styles.progressDotActive : {}),
								...(i === state.passIndex ? styles.progressDotCurrent : {}),
							}}
						/>
					))}
				</div>
			</div>

			<div style={{ ...styles.section, gap: spacing.sm }}>
				<div style={styles.stat}>
					<span style={styles.label}>Time</span>
					<span
						style={{
							...styles.timer,
							...(isTimerLow ? styles.timerLow : {}),
						}}
					>
						{Math.max(0, state.timeRemaining).toFixed(1)}s
					</span>
				</div>
				<button style={styles.pauseButton} onClick={onPause} title="Pause">
					⏸
				</button>
			</div>
		</div>
	);
}
