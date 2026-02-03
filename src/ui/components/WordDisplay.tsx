import { useState, useEffect } from "react";
import { useGameState } from "@ui/hooks/useGameState";
import { gameManager } from "@game/systems/GameManager";

const styles: Record<string, React.CSSProperties> = {
	container: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: "12px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "12px",
		background: "rgba(0, 0, 0, 0.7)",
		zIndex: 100,
		pointerEvents: "none",
	},
	wordContainer: {
		display: "flex",
		alignItems: "center",
		gap: "8px",
		minHeight: "48px",
	},
	word: {
		fontSize: "28px",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		color: "#fff",
		letterSpacing: "4px",
		minWidth: "120px",
		textAlign: "center",
	},
	feedback: {
		fontSize: "14px",
		fontFamily: "Arial, sans-serif",
		minHeight: "20px",
	},
	feedbackSuccess: {
		color: "#4ade80",
	},
	feedbackError: {
		color: "#f87171",
	},
	controls: {
		display: "flex",
		gap: "12px",
	},
	button: {
		width: "72px",
		height: "48px",
		padding: "0",
		fontSize: "20px",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		border: "none",
		borderRadius: "8px",
		cursor: "pointer",
		transition: "transform 0.1s, opacity 0.1s, background 0.2s",
		pointerEvents: "auto",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	submitButton: {
		background: "#4ade80",
		color: "#000",
	},
	submitButtonDisabled: {
		background: "#2a4a3a",
		color: "#666",
		cursor: "not-allowed",
	},
	clearButton: {
		background: "#000",
		color: "#fff",
	},
	passButton: {
		background: "#fbbf24",
		color: "#000",
	},
	passButtonShoot: {
		background: "#22c55e",
		color: "#000",
	},
	passButtonDisabled: {
		background: "#333",
		color: "#666",
		cursor: "not-allowed",
	},
	deleteButton: {
		background: "#ef4444",
		color: "#fff",
	},
};

interface Feedback {
	message: string;
	isError: boolean;
}

export function WordDisplay() {
	const state = useGameState();
	const [feedback, setFeedback] = useState<Feedback | null>(null);

	const canSubmit = state.currentWord.length >= 3 && state.phase === "playing";
	const canPass = gameManager.canPass();
	const isPlaying = state.phase === "playing";

	useEffect(() => {
		if (feedback) {
			const timer = setTimeout(() => setFeedback(null), 1500);
			return () => clearTimeout(timer);
		}
	}, [feedback]);

	const handleSubmit = () => {
		const result = gameManager.submitWord();
		if (result.success) {
			const bonusText = result.hasBonus ? " (2x!)" : "";
			setFeedback({ message: `+${result.score} points${bonusText}`, isError: false });
		} else {
			setFeedback({ message: result.reason || "Invalid", isError: true });
			gameManager.clearWord();
		}
	};

	const handleClear = () => {
		gameManager.clearWord();
	};

	const handleDelete = () => {
		gameManager.removeLetter();
	};

	const handlePass = () => {
		gameManager.executePass();
	};

	return (
		<div style={styles.container}>
			<div style={styles.wordContainer}>
				<span style={styles.word}>{state.currentWord || "\u00A0"}</span>
			</div>

			<div
				style={{
					...styles.feedback,
					...(feedback?.isError ? styles.feedbackError : styles.feedbackSuccess),
				}}
			>
				{feedback?.message || "\u00A0"}
			</div>

			<div style={styles.controls}>
				<button
					style={{
						...styles.button,
						...styles.clearButton,
					}}
					onClick={handleClear}
					disabled={!isPlaying || state.currentWord.length === 0}
					title="Clear"
				>
					🗑️
				</button>

				<button
					style={{
						...styles.button,
						...styles.deleteButton,
					}}
					onClick={handleDelete}
					disabled={!isPlaying || state.currentWord.length === 0}
					title="Backspace"
				>
					⌫
				</button>

				<button
					style={{
						...styles.button,
						...(canPass
							? state.passIndex === 4
								? styles.passButtonShoot
								: styles.passButton
							: styles.passButtonDisabled),
					}}
					onClick={handlePass}
					disabled={!canPass}
					title={state.passIndex < 4 ? "Pass" : "Shoot"}
				>
					⚽
				</button>

				<button
					style={{
						...styles.button,
						...(canSubmit ? styles.submitButton : styles.submitButtonDisabled),
					}}
					onClick={handleSubmit}
					disabled={!canSubmit}
					title="Submit"
				>
					↵
				</button>
			</div>
		</div>
	);
}
