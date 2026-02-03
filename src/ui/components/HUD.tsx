import { useGameState } from "@ui/hooks/useGameState";
import { PASS_THRESHOLDS } from "@shared/types";

const styles: Record<string, React.CSSProperties> = {
	container: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		padding: "8px 12px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		background: "rgba(0, 0, 0, 0.6)",
		color: "#fff",
		fontFamily: "Arial, sans-serif",
		fontSize: "14px",
		zIndex: 100,
		pointerEvents: "none",
	},
	pauseButton: {
		background: "transparent",
		border: "none",
		color: "#fff",
		fontSize: "24px",
		cursor: "pointer",
		padding: "4px 8px",
		pointerEvents: "auto",
	},
	section: {
		display: "flex",
		alignItems: "center",
		gap: "16px",
	},
	stat: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	label: {
		fontSize: "10px",
		color: "#aaa",
		textTransform: "uppercase",
	},
	value: {
		fontSize: "18px",
		fontWeight: "bold",
	},
	goals: {
		fontSize: "24px",
		fontWeight: "bold",
		color: "#ffd700",
	},
	timer: {
		fontSize: "20px",
		fontWeight: "bold",
	},
	timerLow: {
		color: "#ff6b6b",
	},
	progress: {
		display: "flex",
		gap: "4px",
		alignItems: "center",
	},
	progressDot: {
		width: "8px",
		height: "8px",
		borderRadius: "50%",
		background: "#444",
	},
	progressDotActive: {
		background: "#4ade80",
	},
	progressDotCurrent: {
		background: "#fbbf24",
		boxShadow: "0 0 6px #fbbf24",
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

			<div style={{ ...styles.section, gap: "8px" }}>
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
