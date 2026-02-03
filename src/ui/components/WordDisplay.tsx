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
		padding: "12px 24px",
		fontSize: "16px",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		border: "none",
		borderRadius: "8px",
		cursor: "pointer",
		transition: "transform 0.1s, opacity 0.1s",
		pointerEvents: "auto",
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
		background: "#64748b",
		color: "#fff",
	},
	passButton: {
		background: "#fbbf24",
		color: "#000",
	},
	deleteButton: {
		background: "#ef4444",
		color: "#fff",
		padding: "12px 16px",
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
			setFeedback({ message: `+${result.score} points!`, isError: false });
		} else {
			setFeedback({ message: result.reason || "Invalid", isError: true });
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
				>
					Clear
				</button>

				<button
					style={{
						...styles.button,
						...styles.deleteButton,
					}}
					onClick={handleDelete}
					disabled={!isPlaying || state.currentWord.length === 0}
				>
					⌫
				</button>

				<button
					style={{
						...styles.button,
						...(canSubmit ? styles.submitButton : styles.submitButtonDisabled),
					}}
					onClick={handleSubmit}
					disabled={!canSubmit}
				>
					Submit
				</button>

				{canPass && (
					<button
						style={{
							...styles.button,
							...styles.passButton,
						}}
						onClick={handlePass}
					>
						{state.passIndex < 4 ? "Pass!" : "Shoot!"}
					</button>
				)}
			</div>
		</div>
	);
}
