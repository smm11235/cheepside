import { useState } from "react";
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
		background: colors.surface.overlayDark,
		zIndex: layout.zIndex.menu,
	},
	title: {
		fontSize: typography.fontSize["4xl"],
		fontWeight: typography.fontWeight.bold,
		fontFamily: typography.fontFamily.primary,
		color: colors.text.primary,
		marginBottom: spacing.sm,
	},
	subtitle: {
		fontSize: typography.fontSize.base,
		fontFamily: typography.fontFamily.primary,
		color: colors.text.secondary,
		marginBottom: spacing["3xl"],
	},
	buttonContainer: {
		display: "flex",
		flexDirection: "column",
		gap: spacing.lg,
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
		minWidth: "200px",
		boxShadow: `0 4px 12px rgba(74, 222, 128, 0.3)`,
	},
	buttonDisabled: {
		background: colors.state.disabled,
		color: colors.state.disabledText,
		cursor: "not-allowed",
		boxShadow: "none",
	},
	secondaryButton: {
		background: "#64748b",
		color: colors.text.primary,
		boxShadow: "0 4px 12px rgba(100, 116, 139, 0.3)",
	},
	howToPlayButton: {
		background: "transparent",
		color: colors.text.secondary,
		border: `1px solid ${colors.state.disabled}`,
		boxShadow: "none",
		fontSize: typography.fontSize.base,
		padding: `${spacing.md} ${spacing["2xl"]}`,
	},
	// How to Play modal
	modal: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: "90%",
		maxWidth: "360px",
		maxHeight: "80%",
		background: colors.surface.card,
		borderRadius: layout.borderRadius.xl,
		overflow: "hidden",
		display: "flex",
		flexDirection: "column",
		boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
	},
	modalHeader: {
		padding: `${spacing.lg} ${spacing.xl}`,
		borderBottom: `1px solid ${colors.state.disabled}`,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	modalTitle: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		fontFamily: typography.fontFamily.primary,
		color: colors.text.primary,
		margin: 0,
	},
	closeButton: {
		background: "transparent",
		border: "none",
		color: colors.text.secondary,
		fontSize: typography.fontSize.xl,
		cursor: "pointer",
		padding: `${spacing.xs} ${spacing.sm}`,
	},
	modalContent: {
		padding: spacing.xl,
		overflowY: "auto",
		flex: 1,
	},
	section: {
		marginBottom: spacing.xl,
	},
	sectionTitle: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.bold,
		fontFamily: typography.fontFamily.primary,
		color: colors.primary,
		textTransform: "uppercase",
		marginBottom: spacing.sm,
	},
	text: {
		fontSize: typography.fontSize.sm,
		fontFamily: typography.fontFamily.primary,
		color: "#ccc",
		lineHeight: typography.lineHeight.normal,
		margin: 0,
	},
	listItem: {
		fontSize: typography.fontSize.sm,
		fontFamily: typography.fontFamily.primary,
		color: "#ccc",
		lineHeight: typography.lineHeight.relaxed,
		marginBottom: spacing.xs,
	},
	highlight: {
		color: colors.text.highlight,
		fontWeight: typography.fontWeight.bold,
	},
};

interface MenuOverlayProps {
	isVisible: boolean;
	canContinue: boolean;
	onNewGame: () => void;
	onContinue: () => void;
}

export function MenuOverlay({ isVisible, canContinue, onNewGame, onContinue }: MenuOverlayProps) {
	const [showHowToPlay, setShowHowToPlay] = useState(false);

	if (!isVisible) return null;

	if (showHowToPlay) {
		return (
			<div style={styles.overlay}>
				<div style={styles.modal}>
					<div style={styles.modalHeader}>
						<h2 style={styles.modalTitle}>How to Play</h2>
						<button style={styles.closeButton} onClick={() => setShowHowToPlay(false)}>
							×
						</button>
					</div>
					<div style={styles.modalContent}>
						<div style={styles.section}>
							<div style={styles.sectionTitle}>Goal</div>
							<p style={styles.text}>
								Spell words to advance the ball down the pitch and score goals!
							</p>
						</div>

						<div style={styles.section}>
							<div style={styles.sectionTitle}>Spelling</div>
							<p style={styles.text}>
								Tap letters or use keyboard to spell words. Letters can be reused.
								Words using the <span style={styles.highlight}>center letter</span> score 2× points.
							</p>
						</div>

						<div style={styles.section}>
							<div style={styles.sectionTitle}>Passing & Shooting</div>
							<p style={styles.text}>
								Reach point thresholds to unlock the ⚽ button:
							</p>
							<div style={{ marginTop: spacing.sm }}>
								<div style={styles.listItem}>• Pass 1: 5 pts</div>
								<div style={styles.listItem}>• Pass 2: 20 pts</div>
								<div style={styles.listItem}>• Pass 3: 40 pts</div>
								<div style={styles.listItem}>• Pass 4: 65 pts</div>
								<div style={styles.listItem}>• <span style={styles.highlight}>Shoot: 100 pts</span></div>
							</div>
						</div>

						<div style={styles.section}>
							<div style={styles.sectionTitle}>Time</div>
							<p style={styles.text}>
								You start with 60 seconds. Each pass adds +15 seconds (max 120s).
								If time runs out, you lose possession!
							</p>
						</div>

						<div style={styles.section}>
							<div style={styles.sectionTitle}>Controls</div>
							<div style={{ marginTop: spacing.sm }}>
								<div style={styles.listItem}>🗑️ Clear word</div>
								<div style={styles.listItem}>⌫ Delete last letter</div>
								<div style={styles.listItem}>⚽ Pass or Shoot</div>
								<div style={styles.listItem}>↵ Submit word</div>
							</div>
						</div>

						<div style={styles.section}>
							<div style={styles.sectionTitle}>Keyboard Shortcuts</div>
							<div style={{ marginTop: spacing.sm }}>
								<div style={styles.listItem}>A-Z: Type letters</div>
								<div style={styles.listItem}>Enter: Submit word</div>
								<div style={styles.listItem}>Backspace: Delete</div>
								<div style={styles.listItem}>Space: Pass/Shoot</div>
								<div style={styles.listItem}>Escape: Clear word</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div style={styles.overlay}>
			<div style={styles.title}>Cheepside</div>
			<div style={styles.subtitle}>A word game about birds and football</div>

			<div style={styles.buttonContainer}>
				<button style={styles.button} onClick={onNewGame}>
					New Game
				</button>

				<button
					style={{
						...styles.button,
						...styles.secondaryButton,
						...(canContinue ? {} : styles.buttonDisabled),
					}}
					onClick={onContinue}
					disabled={!canContinue}
				>
					Continue
				</button>
			</div>

			<button
				style={{ ...styles.button, ...styles.howToPlayButton }}
				onClick={() => setShowHowToPlay(true)}
			>
				How to Play
			</button>
		</div>
	);
}
