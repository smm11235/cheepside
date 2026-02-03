/**
 * Cheepside Design System
 *
 * This file contains all visual design tokens for the game.
 * Edit these values to customize the look and feel.
 *
 * COLOR NAMING CONVENTION:
 * - Primary: Main brand/accent colors
 * - Surface: Background colors for different layers
 * - Text: Text colors for different contexts
 * - State: Colors for interactive states (success, error, warning)
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const colors = {
	// ----- Brand Colors -----
	primary: "#4ade80", // Green - main action color
	primaryDark: "#22c55e", // Darker green for shoot button
	secondary: "#fbbf24", // Yellow/amber - pass button, highlights
	accent: "#ffd700", // Gold - goals, achievements

	// ----- Surface Colors -----
	surface: {
		background: "#1a1a2e", // Main app background (dark blue-grey)
		pitch: "#2d8a3e", // Football pitch green
		overlay: "rgba(0, 0, 0, 0.7)", // Semi-transparent overlays
		overlayDark: "rgba(0, 0, 0, 0.95)", // Menu overlay
		card: "#1a1a2e", // Card/modal background
		hudBackground: "rgba(0, 0, 0, 0.6)", // HUD bar background
	},

	// ----- Football Panel Colors -----
	football: {
		pentagon: "#000000", // Center pentagon - black
		pentagonBorder: "#333333", // Pentagon border
		hexagon: "#ffffff", // Surrounding hexagons - white
		hexagonBorder: "#cccccc", // Hexagon border
		outline: "#444466", // Ball outline circle
	},

	// ----- Text Colors -----
	text: {
		primary: "#ffffff", // Main text
		secondary: "#888888", // Subdued text, labels
		muted: "#666666", // Disabled text
		onPentagon: "#ffffff", // Text on black pentagon
		onHexagon: "#000000", // Text on white hexagon
		onPrimary: "#000000", // Text on primary color buttons
		highlight: "#fbbf24", // Highlighted text (yellow)
	},

	// ----- State Colors -----
	state: {
		success: "#4ade80", // Success feedback
		error: "#f87171", // Error feedback, timer low
		warning: "#fbbf24", // Warning states
		disabled: "#333333", // Disabled elements
		disabledText: "#666666", // Disabled text
	},

	// ----- Button Colors -----
	button: {
		clear: "#000000", // Clear/trash button
		delete: "#ef4444", // Backspace button
		pass: "#fbbf24", // Pass button
		shoot: "#22c55e", // Shoot button
		submit: "#4ade80", // Submit button
		disabled: "#333333", // Disabled button
		shadow: "rgba(200, 200, 200, 0.3)", // Button drop shadow
	},

	// ----- Pitch Line Colors -----
	pitch: {
		lines: "#ffffff",
		linesOpacity: 0.8,
		ball: "#ffffff",
		ballBorder: "#000000",
	},

	// ----- Progress Indicators -----
	progress: {
		inactive: "#444444",
		active: "#4ade80",
		current: "#fbbf24",
	},
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
	fontFamily: {
		primary: "Arial, sans-serif",
		mono: "monospace",
	},

	fontSize: {
		xs: "10px",
		sm: "14px",
		base: "16px",
		lg: "20px",
		xl: "24px",
		"2xl": "28px",
		"3xl": "32px",
		"4xl": "48px",
	},

	fontWeight: {
		normal: "400" as const,
		bold: "700" as const,
	},

	letterSpacing: {
		normal: "0",
		wide: "4px",
	},

	lineHeight: {
		tight: 1.2,
		normal: 1.5,
		relaxed: 1.6,
	},
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
	xs: "4px",
	sm: "8px",
	md: "12px",
	lg: "16px",
	xl: "20px",
	"2xl": "32px",
	"3xl": "48px",
} as const;

// =============================================================================
// LAYOUT
// =============================================================================

export const layout = {
	// Pitch area (top of screen)
	pitch: {
		heightRatio: 0.20, // 20% of screen height (reduced from 30%)
	},

	// Football interface area
	ball: {
		// Relative sizes for the football geometry
		pentagonRadius: 55, // Base size of center pentagon
		intermediateRadius: 85, // Radius for hex-hex junction points
		outerRadius: 105, // Radius for outer hex vertices
		outerAngleOffset: 18, // Degrees - controls hexagon width at outer edge
	},

	// Bottom controls area
	controls: {
		buttonWidth: "72px",
		buttonHeight: "48px",
		buttonGap: "12px",
		containerPadding: "12px",
	},

	// Common border radius values
	borderRadius: {
		sm: "4px",
		md: "8px",
		lg: "12px",
		xl: "16px",
	},

	// Z-index layers
	zIndex: {
		pitch: 0,
		ballInterface: 10,
		hud: 100,
		overlay: 200,
		menu: 300,
	},
} as const;

// =============================================================================
// ANIMATIONS
// =============================================================================

export const animation = {
	duration: {
		fast: 100,
		normal: 200,
		slow: 300,
	},
	easing: {
		default: "Power2",
	},
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Convert hex color to Phaser-compatible number format
 * @param hex - Hex color string (e.g., "#ffffff" or "ffffff")
 * @returns Number for Phaser graphics (e.g., 0xffffff)
 */
export function hexToNumber(hex: string): number {
	const cleanHex = hex.replace("#", "");
	return parseInt(cleanHex, 16);
}

/**
 * Calculate football vertex positions for the ball interface
 * Returns pentagon vertices and hexagon vertices for all 5 hexagons
 */
export function calculateFootballGeometry(scale: number = 1) {
	const P = layout.ball.pentagonRadius * scale;
	const P_inter = layout.ball.intermediateRadius * scale;
	const P_outer = layout.ball.outerRadius * scale;
	const alpha = (layout.ball.outerAngleOffset * Math.PI) / 180;

	// Pentagon vertices (5 points)
	const pentagonVertices: { x: number; y: number }[] = [];
	for (let i = 0; i < 5; i++) {
		const theta = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
		pentagonVertices.push({
			x: P * Math.cos(theta),
			y: P * Math.sin(theta),
		});
	}

	// Hexagon vertices (6 points each, for 5 hexagons)
	const hexagonVertices: { x: number; y: number }[][] = [];
	for (let i = 0; i < 5; i++) {
		const theta_i = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
		const theta_next = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / 5;

		// 6 vertices going counterclockwise from pentagon vertex i
		const hex: { x: number; y: number }[] = [
			// 1. Pentagon vertex i
			{ x: P * Math.cos(theta_i), y: P * Math.sin(theta_i) },
			// 2. Intermediate point at angle theta_i (shared with previous hex)
			{ x: P_inter * Math.cos(theta_i), y: P_inter * Math.sin(theta_i) },
			// 3. Outer left vertex
			{
				x: P_outer * Math.cos(theta_i + alpha),
				y: P_outer * Math.sin(theta_i + alpha),
			},
			// 4. Outer right vertex
			{
				x: P_outer * Math.cos(theta_next - alpha),
				y: P_outer * Math.sin(theta_next - alpha),
			},
			// 5. Intermediate point at angle theta_next (shared with next hex)
			{ x: P_inter * Math.cos(theta_next), y: P_inter * Math.sin(theta_next) },
			// 6. Pentagon vertex i+1
			{ x: P * Math.cos(theta_next), y: P * Math.sin(theta_next) },
		];
		hexagonVertices.push(hex);
	}

	return { pentagonVertices, hexagonVertices };
}
