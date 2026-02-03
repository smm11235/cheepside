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
		outerPentagon: "#000000", // Outer pentagons (partial) - black
		outerPentagonBorder: "#333333",
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
	// HUD bar height (for positioning pitch below it)
	hudHeight: 50,

	// Pitch area (top of screen, below HUD)
	pitch: {
		heightRatio: 0.15, // 15% of screen height (will be positioned below HUD)
	},

	// Football interface area
	ball: {
		// Pentagon (center) size
		pentagonRadius: 50,

		// Perspective effect: hexagons taper toward outer edge
		// These control the "ring" where hexagons share edges with each other
		shareRadius: 75, // Radius for vertices shared between hexagons
		shareAngleOffset: 8, // Degrees offset from pentagon vertex angle

		// Outer edge of hexagons (furthest from center, shortest edge)
		outerRadius: 95, // Radius for outer hexagon vertices
		outerAngleOffset: 28, // Degrees - larger = shorter outer edge

		// Ball outline circle
		outlineRadiusMultiplier: 1.08, // Multiplier of outerRadius for the circle

		// Outer ring of partial pentagons (at corners where hexagons meet)
		outerPentagonRadius: 105, // Center of outer pentagons
	},

	// Bottom controls area - FIXED HEIGHT
	controls: {
		height: 120, // Fixed height for bottom area
		buttonWidth: "72px",
		buttonHeight: "48px",
		buttonGap: "12px",
		containerPadding: "8px",
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
 *
 * Geometry explanation:
 * - Central pentagon with 5 vertices
 * - 5 hexagons surrounding it, each sharing one edge with the pentagon
 * - Each hexagon has 6 vertices with perspective tapering (outer edge shorter)
 * - 5 partial pentagons visible at the "corners" where hexagons meet
 *
 * Perspective effect:
 * - Pentagon edge (closest to viewer) = longest
 * - Edges shared with neighboring hexagons = medium
 * - Outer edge (furthest from viewer) = shortest
 */
export function calculateFootballGeometry(scale: number = 1) {
	const P = layout.ball.pentagonRadius * scale;
	const R_share = layout.ball.shareRadius * scale;
	const R_outer = layout.ball.outerRadius * scale;
	const beta = (layout.ball.shareAngleOffset * Math.PI) / 180;
	const gamma = (layout.ball.outerAngleOffset * Math.PI) / 180;

	// Pentagon vertices (5 points, starting at top)
	const pentagonVertices: { x: number; y: number }[] = [];
	for (let i = 0; i < 5; i++) {
		const theta = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
		pentagonVertices.push({
			x: P * Math.cos(theta),
			y: P * Math.sin(theta),
		});
	}

	// Hexagon vertices with perspective tapering
	// Each hexagon has 6 vertices forming a shape that tapers toward the outer edge
	const hexagonVertices: { x: number; y: number }[][] = [];

	for (let i = 0; i < 5; i++) {
		const theta_i = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
		const theta_next = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / 5;
		const theta_hex = (theta_i + theta_next) / 2; // Hexagon center direction

		// 6 vertices going around the hexagon:
		// 1. Pentagon vertex i (Vi)
		// 2. Shared vertex with hex i-1 (between Vi direction and hex center)
		// 3. Outer left vertex
		// 4. Outer right vertex
		// 5. Shared vertex with hex i+1 (between hex center and V(i+1) direction)
		// 6. Pentagon vertex i+1 (V(i+1))

		const hex: { x: number; y: number }[] = [
			// 1. Pentagon vertex i
			pentagonVertices[i],
			// 2. Shared with previous hex - at angle between Vi and hex center
			{
				x: R_share * Math.cos(theta_i + beta),
				y: R_share * Math.sin(theta_i + beta),
			},
			// 3. Outer left - closer to hex center
			{
				x: R_outer * Math.cos(theta_hex - gamma),
				y: R_outer * Math.sin(theta_hex - gamma),
			},
			// 4. Outer right - closer to hex center
			{
				x: R_outer * Math.cos(theta_hex + gamma),
				y: R_outer * Math.sin(theta_hex + gamma),
			},
			// 5. Shared with next hex - at angle between hex center and V(i+1)
			{
				x: R_share * Math.cos(theta_next - beta),
				y: R_share * Math.sin(theta_next - beta),
			},
			// 6. Pentagon vertex i+1
			pentagonVertices[(i + 1) % 5],
		];
		hexagonVertices.push(hex);
	}

	// Outer partial pentagons (at corners where hexagons meet)
	// These are the black pentagons visible beyond the white hexagons
	const R_outerPent = layout.ball.outerPentagonRadius * scale;
	const outerPentagonVertices: { x: number; y: number }[][] = [];

	for (let i = 0; i < 5; i++) {
		const theta_i = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
		// The outer pentagon is centered at angle theta_i (same as pentagon vertex)
		// It's partially visible between two hexagons

		// We only need 3 vertices for the visible portion:
		// - The shared vertex from hex (i-1) (vertex 5 of hex i-1, which is vertex 2 of hex i)
		// - The apex of the outer pentagon
		// - The shared vertex from hex i (vertex 2 of hex i)

		const prevHexIdx = (i + 4) % 5;
		const outerPent: { x: number; y: number }[] = [
			// Shared vertex from previous hex (their vertex 5)
			hexagonVertices[prevHexIdx][4],
			// Apex of outer pentagon (pointing outward)
			{
				x: R_outerPent * Math.cos(theta_i),
				y: R_outerPent * Math.sin(theta_i),
			},
			// Shared vertex from current hex (their vertex 2)
			hexagonVertices[i][1],
		];
		outerPentagonVertices.push(outerPent);
	}

	// Ball outline radius
	const outlineRadius = R_outer * layout.ball.outlineRadiusMultiplier;

	return {
		pentagonVertices,
		hexagonVertices,
		outerPentagonVertices,
		outlineRadius,
	};
}

/**
 * Calculate the visual centroid of a polygon
 * This is where text should be placed for it to appear centered
 */
export function calculatePolygonCentroid(
	vertices: { x: number; y: number }[]
): { x: number; y: number } {
	let cx = 0;
	let cy = 0;
	let area = 0;

	for (let i = 0; i < vertices.length; i++) {
		const j = (i + 1) % vertices.length;
		const cross = vertices[i].x * vertices[j].y - vertices[j].x * vertices[i].y;
		area += cross;
		cx += (vertices[i].x + vertices[j].x) * cross;
		cy += (vertices[i].y + vertices[j].y) * cross;
	}

	area /= 2;
	cx /= 6 * area;
	cy /= 6 * area;

	return { x: cx, y: cy };
}
