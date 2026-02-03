import { useState, useEffect } from "react";
import { useGameState } from "@ui/hooks/useGameState";
import { gameManager } from "@game/systems/GameManager";
import { colors, typography, spacing, layout } from "@shared/theme";

const styles: Record<string, React.CSSProperties> = {
	container: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: spacing.sm,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: spacing.sm,
		background: colors.surface.overlay,
		zIndex: layout.zIndex.hud,
		pointerEvents: "none",
	},
	wordContainer: {
		display: "flex",
		alignItems: "center",
		gap: spacing.sm,
		minHeight: "40px",
	},
	word: {
		fontSize: typography.fontSize["2xl"],
		fontWeight: typography.fontWeight.bold,
		fontFamily: typography.fontFamily.primary,
		color: colors.text.primary,
		letterSpacing: typography.letterSpacing.wide,
		minWidth: "120px",
		textAlign: "center",
	},
	feedback: {
		fontSize: typography.fontSize.sm,
		fontFamily: typography.fontFamily.primary,
		minHeight: "18px",
	},
	feedbackSuccess: {
		color: colors.state.success,
	},
	feedbackError: {
		color: colors.state.error,
	},
	controls: {
		display: "flex",
		gap: layout.controls.buttonGap,
	},
	button: {
		width: layout.controls.buttonWidth,
		height: layout.controls.buttonHeight,
		padding: "0",
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		fontFamily: typography.fontFamily.primary,
		border: "none",
		borderRadius: layout.borderRadius.md,
		cursor: "pointer",
		transition: "transform 0.1s, opacity 0.1s, background 0.2s",
		pointerEvents: "auto",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		boxShadow: `0 2px 8px ${colors.button.shadow}`,
	},
	submitButton: {
		background: colors.button.submit,
		color: colors.text.onPrimary,
	},
	submitButtonDisabled: {
		background: colors.state.disabled,
		color: colors.state.disabledText,
		cursor: "not-allowed",
	},
	clearButton: {
		background: colors.button.clear,
		color: colors.text.primary,
	},
	passButton: {
		background: colors.button.pass,
		color: colors.text.onPrimary,
	},
	passButtonShoot: {
		background: colors.button.shoot,
		color: colors.text.onPrimary,
	},
	passButtonDisabled: {
		background: colors.button.disabled,
		color: colors.state.disabledText,
		cursor: "not-allowed",
	},
	deleteButton: {
		background: colors.button.delete,
		color: colors.text.primary,
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
