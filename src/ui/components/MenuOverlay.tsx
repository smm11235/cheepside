import { useState } from "react";

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
		background: "rgba(0, 0, 0, 0.95)",
		zIndex: 300,
	},
	title: {
		fontSize: "48px",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		color: "#fff",
		marginBottom: "8px",
	},
	subtitle: {
		fontSize: "16px",
		fontFamily: "Arial, sans-serif",
		color: "#888",
		marginBottom: "48px",
	},
	buttonContainer: {
		display: "flex",
		flexDirection: "column",
		gap: "16px",
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
		minWidth: "200px",
		boxShadow: "0 4px 12px rgba(74, 222, 128, 0.3)",
	},
	buttonDisabled: {
		background: "#333",
		color: "#666",
		cursor: "not-allowed",
		boxShadow: "none",
	},
	secondaryButton: {
		background: "#64748b",
		color: "#fff",
		boxShadow: "0 4px 12px rgba(100, 116, 139, 0.3)",
	},
	howToPlayButton: {
		background: "transparent",
		color: "#888",
		border: "1px solid #444",
		boxShadow: "none",
		fontSize: "16px",
		padding: "12px 32px",
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
		background: "#1a1a2e",
		borderRadius: "16px",
		overflow: "hidden",
		display: "flex",
		flexDirection: "column",
		boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
	},
	modalHeader: {
		padding: "16px 20px",
		borderBottom: "1px solid #333",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	modalTitle: {
		fontSize: "20px",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		color: "#fff",
		margin: 0,
	},
	closeButton: {
		background: "transparent",
		border: "none",
		color: "#888",
		fontSize: "24px",
		cursor: "pointer",
		padding: "4px 8px",
	},
	modalContent: {
		padding: "20px",
		overflowY: "auto",
		flex: 1,
	},
	section: {
		marginBottom: "20px",
	},
	sectionTitle: {
		fontSize: "14px",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		color: "#4ade80",
		textTransform: "uppercase",
		marginBottom: "8px",
	},
	text: {
		fontSize: "14px",
		fontFamily: "Arial, sans-serif",
		color: "#ccc",
		lineHeight: 1.5,
		margin: 0,
	},
	listItem: {
		fontSize: "14px",
		fontFamily: "Arial, sans-serif",
		color: "#ccc",
		lineHeight: 1.6,
		marginBottom: "4px",
	},
	highlight: {
		color: "#fbbf24",
		fontWeight: "bold",
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
							<div style={{ marginTop: "8px" }}>
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
							<div style={{ marginTop: "8px" }}>
								<div style={styles.listItem}>🗑️ Clear word</div>
								<div style={styles.listItem}>⌫ Delete last letter</div>
								<div style={styles.listItem}>⚽ Pass or Shoot</div>
								<div style={styles.listItem}>↵ Submit word</div>
							</div>
						</div>

						<div style={styles.section}>
							<div style={styles.sectionTitle}>Keyboard Shortcuts</div>
							<div style={{ marginTop: "8px" }}>
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
