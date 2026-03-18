/**
 * ============================================================
 *  vertex ADMIN — GLOBAL THEME
 * ============================================================
 *  Central file for all shared colors, fonts, and reusable
 *  style objects. Update values here to change the look of
 *  every page in the admin panel.
 * ============================================================
 */


/* ========================================
 *  COLORS
 * ========================================
 *  All color constants used across the UI.
 *  Change these to rebrand the entire panel.
 * ======================================== */

// Primary accent (Cyan / Sky)
export const primary       = '#0ea5e9';
export const primaryLight  = '#38bdf8';
export const primaryDark   = '#0284c7';

// Backgrounds
export const bgMain        = '#0b0f19';   // Dialogs, panels, body
export const bgLight       = '#1e293b';   // Slightly lighter panels
export const bgDark        = '#030712';   // Table headers, sticky bars
export const bgPanel       = 'rgba(11,15,25,0.96)';  // Glassmorphic panels

// Status colors
export const success       = '#10b981';
export const error         = '#ef4444';
export const errorAlt      = '#dc2626';   // Alternative red (door lock)
export const warning       = '#f59e0b';
export const info          = '#3b82f6';

// Text
export const textPrimary   = '#ffffff';
export const textSecondary = '#94a3b8';
export const textMuted     = '#64748b';
export const textDimmed    = '#475569';
export const textDisabled  = '#334155';

// Borders
export const borderTeal         = 'rgba(14,165,233,0.15)';
export const borderTealHover    = 'rgba(14,165,233,0.35)';
export const borderTealLight    = 'rgba(14,165,233,0.08)';
export const borderTealStrong   = 'rgba(14,165,233,0.25)';
export const borderTealFocus    = 'rgba(14,165,233,0.5)';
export const borderSubtle       = 'rgba(255,255,255,0.04)';
export const borderSubtleHover  = 'rgba(255,255,255,0.08)';



/* ========================================
 *  FONTS
 * ========================================
 *  Font families used throughout the UI.
 * ======================================== */

export const fontBody    = "'Inter', sans-serif";
export const fontHeading = "'Outfit', sans-serif";
export const fontMono    = 'monospace';



/* ========================================
 *  HELPERS
 * ========================================
 *  Utility functions for generating colors
 *  with custom opacity on the fly.
 * ======================================== */

/** Generate rgba(14,165,233, opacity) */
export const tealAlpha  = (a) => `rgba(14,165,233,${a})`;

/** Generate rgba(255,255,255, opacity) */
export const whiteAlpha = (a) => `rgba(255,255,255,${a})`;



/* ========================================
 *  INPUT STYLES — MUI TextField sx prop
 * ========================================
 *  Pass as `sx={inputSx}` on any MUI
 *  TextField for the standard teal look.
 * ======================================== */

/**
 * Standard input — teal borders, Rajdhani font.
 * Used by Players, SearchItems, ItemModal, PedManagement.
 */
export const inputSx = {
	'& .MuiOutlinedInput-root': {
		fontFamily: fontBody,
		fontSize: 14,
		color: textPrimary,
		background: whiteAlpha(0.03),
		borderRadius: '2px',
		'& fieldset': { borderColor: borderTeal },
		'&:hover fieldset': { borderColor: borderTealHover },
		'&.Mui-focused fieldset': { borderColor: primary, borderWidth: '1px' },
	},
	'& .MuiInputLabel-root': {
		fontFamily: fontBody,
		fontSize: 13,
		fontWeight: 600,
		color: textMuted,
		'&.Mui-focused': { color: primary },
	},
	'& .MuiSelect-select': {
		fontFamily: fontBody,
		fontSize: 14,
	},
};

/**
 * Form field input — subtle white borders, teal focus.
 * Used by DoorLockTool, ElevatorTool dialogs.
 */
export const formFieldSx = {
	marginBottom: 12,
	'& .MuiOutlinedInput-root': {
		fontFamily: fontBody,
		background: whiteAlpha(0.04),
		borderRadius: 6,
		fontSize: 13,
		color: textPrimary,
		'& fieldset': { borderColor: borderSubtleHover },
		'&:hover fieldset': { borderColor: tealAlpha(0.3) },
		'&.Mui-focused fieldset': { borderColor: borderTealFocus },
	},
	'& .MuiInputLabel-root': {
		fontFamily: fontBody,
		color: 'rgba(255,255,255,0.4)',
		fontSize: 13,
	},
	'& .MuiInputLabel-root.Mui-focused': { color: primaryLight },
};

/**
 * Small field — compact variant for nested forms.
 * Used inside restriction editors, floor editors, etc.
 */
export const smallFieldSx = {
	'& .MuiOutlinedInput-root': {
		background: whiteAlpha(0.04),
		borderRadius: 6,
		fontSize: 12,
		color: textPrimary,
		'& fieldset': { borderColor: borderSubtle },
		'&:hover fieldset': { borderColor: tealAlpha(0.2) },
		'&.Mui-focused fieldset': { borderColor: borderTealHover },
	},
	'& .MuiInputLabel-root': { color: textDimmed, fontSize: 12 },
	'& .MuiSelect-icon': { color: textDimmed },
};

/**
 * Search field with icon — used in DoorLockTool/ElevatorTool filter bars.
 */
export const searchFieldSx = {
	flex: 1,
	maxWidth: 300,
	'& .MuiOutlinedInput-root': {
		fontFamily: fontBody,
		background: whiteAlpha(0.04),
		borderRadius: 6,
		fontSize: 13,
		color: textPrimary,
		'& fieldset': { borderColor: borderSubtleHover },
		'&:hover fieldset': { borderColor: tealAlpha(0.3) },
		'&.Mui-focused fieldset': { borderColor: borderTealFocus },
	},
	'& .MuiInputAdornment-root': { color: textDimmed },
};


/* ========================================
 *  BUTTON STYLES — makeStyles compatible
 * ========================================
 *  Use in makeStyles: `actionBtn: styles.actionBtn`
 *  or spread: `...styles.actionBtn`
 * ======================================== */

/** Standard teal action button */
export const actionBtn = {
	fontFamily: fontBody,
	fontSize: 11,
	fontWeight: 700,
	letterSpacing: '0.1em',
	textTransform: 'uppercase',
	background: tealAlpha(0.12),
	border: `1px solid ${borderTealStrong}`,
	borderRadius: 8,
	color: primary,
	padding: '5px 12px',
	cursor: 'pointer',
	transition: 'all 0.2s ease',
	display: 'flex',
	alignItems: 'center',
	gap: 5,
	'&:hover': {
		background: tealAlpha(0.25),
		borderColor: primary,
		boxShadow: `0 0 12px ${tealAlpha(0.25)}`,
	},
	'&:disabled': {
		opacity: 0.3,
		cursor: 'not-allowed',
		'&:hover': {
			background: tealAlpha(0.12),
			borderColor: borderTealStrong,
			boxShadow: 'none',
		},
	},
};

/** Header button — slightly larger, used in page headers */
export const headerBtn = {
	...actionBtn,
	fontSize: 11,
	padding: '6px 14px',
	gap: 6,
};

/** Cancel / close button */
export const cancelBtn = {
	fontFamily: fontBody,
	fontSize: 12,
	fontWeight: 700,
	letterSpacing: '0.1em',
	textTransform: 'uppercase',
	background: 'transparent',
	border: `1px solid ${borderSubtleHover}`,
	borderRadius: 8,
	color: 'rgba(255,255,255,0.4)',
	padding: '6px 16px',
	cursor: 'pointer',
	'&:hover': {
		borderColor: whiteAlpha(0.2),
		color: textSecondary,
	},
};

/** Save / apply button */
export const saveBtn = {
	fontFamily: fontBody,
	fontSize: 12,
	fontWeight: 700,
	letterSpacing: '0.1em',
	textTransform: 'uppercase',
	background: tealAlpha(0.15),
	border: `1px solid ${borderTealHover}`,
	borderRadius: 8,
	color: primary,
	padding: '6px 16px',
	cursor: 'pointer',
	'&:hover': {
		background: tealAlpha(0.28),
		borderColor: primary,
		boxShadow: `0 0 16px ${tealAlpha(0.3)}`,
	},
};

/** Red danger / remove button */
export const removeBtn = {
	fontFamily: fontBody,
	fontSize: 10,
	fontWeight: 700,
	letterSpacing: '0.1em',
	textTransform: 'uppercase',
	background: 'rgba(240,68,68,0.1)',
	border: '1px solid rgba(240,68,68,0.3)',
	borderRadius: 8,
	color: error,
	padding: '3px 10px',
	cursor: 'pointer',
	transition: 'all 0.2s ease',
	'&:hover': {
		background: 'rgba(240,68,68,0.2)',
		borderColor: error,
	},
};


/* ========================================
 *  TABLE STYLES — Plain CSS objects
 * ========================================
 *  For high-performance tables rendered
 *  with plain HTML (no MUI per-row overhead).
 *  Use as inline styles: style={tableStyles.th}
 * ======================================== */

export const tableStyles = {
	/** Full-width collapsed table */
	table: {
		width: '100%',
		borderCollapse: 'collapse',
		fontSize: 12,
		fontFamily: fontBody,
	},

	/** Sticky header cell */
	th: {
		background: bgDark,
		color: tealAlpha(0.8),
		fontFamily: fontBody,
		fontWeight: 600,
		fontSize: 11,
		textTransform: 'uppercase',
		letterSpacing: '0.5px',
		padding: '8px 12px',
		textAlign: 'left',
		position: 'sticky',
		top: 0,
		zIndex: 1,
		borderBottom: `1px solid ${borderSubtle}`,
	},

	/** Standard table cell */
	td: {
		padding: '6px 12px',
		borderBottom: `1px solid rgba(255,255,255,0.04)`,
		color: textSecondary,
		fontFamily: fontBody,
	},

	/** Monospace text (IDs, hashes) */
	mono: { fontFamily: fontMono, fontSize: 11 },

	/** Coordinate display */
	coords: { fontFamily: fontMono, fontSize: 11, color: 'rgba(255,255,255,0.5)' },

	/** Inline table action button (teal) */
	btn: {
		background: 'none',
		border: 'none',
		padding: '4px 6px',
		cursor: 'pointer',
		color: tealAlpha(0.7),
		fontSize: 12,
	},

	/** Inline table action button (red) */
	btnDanger: {
		background: 'none',
		border: 'none',
		padding: '4px 6px',
		cursor: 'pointer',
		color: 'rgba(231,76,60,0.6)',
		fontSize: 12,
	},

	/** Small rounded badge */
	badge: {
		display: 'inline-block',
		padding: '1px 8px',
		borderRadius: 10,
		fontSize: 10,
		fontFamily: fontBody,
		background: tealAlpha(0.15),
		color: primaryLight,
	},

	/** Clickable filter chip (pass active boolean) */
	chip: (active) => ({
		cursor: 'pointer',
		display: 'inline-flex',
		alignItems: 'center',
		padding: '4px 12px',
		borderRadius: 13,
		fontSize: 11,
		fontFamily: fontBody,
		border: active ? `1px solid ${borderTealHover}` : `1px solid ${borderSubtleHover}`,
		background: active ? tealAlpha(0.2) : whiteAlpha(0.04),
		color: active ? primaryLight : 'rgba(255,255,255,0.5)',
		userSelect: 'none',
	}),

	/** Status stat pill (pass borderColor) */
	stat: (borderColor) => ({
		display: 'inline-flex',
		alignItems: 'center',
		padding: '4px 10px',
		borderRadius: 13,
		fontSize: 11,
		fontFamily: fontBody,
		background: whiteAlpha(0.06),
		border: `1px solid ${borderColor || borderSubtleHover}`,
		color: textSecondary,
	}),

	/** Dynamic header button (pass bg, border, color) */
	headerBtn: (bg, border, color) => ({
		background: bg,
		border: `1px solid ${border}`,
		color,
		fontSize: 12,
		fontFamily: fontBody,
		fontWeight: 600,
		letterSpacing: '0.05em',
		padding: '4px 12px',
		borderRadius: 6,
		cursor: 'pointer',
		display: 'inline-flex',
		alignItems: 'center',
		gap: 6,
	}),

	/** Minimal icon-only button */
	iconBtn: {
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		padding: 4,
		color: tealAlpha(0.7),
		fontSize: 14,
	},

	/** Pagination controls container */
	pager: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 12,
		padding: '8px 0',
		flexShrink: 0,
		color: 'rgba(255,255,255,0.5)',
		fontSize: 12,
		fontFamily: fontBody,
	},

	/** Pagination button (pass disabled boolean) */
	pageBtn: (disabled) => ({
		background: disabled ? whiteAlpha(0.02) : tealAlpha(0.15),
		border: `1px solid ${borderTeal}`,
		color: disabled ? textDisabled : primaryLight,
		borderRadius: 6,
		padding: '4px 10px',
		cursor: disabled ? 'default' : 'pointer',
		fontSize: 11,
		fontFamily: fontBody,
		fontWeight: 600,
	}),

	/** Green capture button (door/elevator helpers) */
	captureBtn: {
		background: 'rgba(46,204,113,0.15)',
		border: '1px solid rgba(46,204,113,0.3)',
		color: '#2ecc71',
		height: 24,
		fontSize: 11,
		fontFamily: fontBody,
		fontWeight: 600,
		padding: '2px 10px',
		borderRadius: 6,
		cursor: 'pointer',
		display: 'inline-flex',
		alignItems: 'center',
		gap: 4,
	},

	/** Status dot indicator (pass locked boolean) */
	dot: (locked) => ({
		width: 8,
		height: 8,
		borderRadius: '50%',
		display: 'inline-block',
		background: locked ? '#2ecc71' : errorAlt,
		boxShadow: locked
			? '0 0 6px rgba(46,204,113,0.5)'
			: `0 0 6px rgba(231,76,60,0.5)`,
	}),
};


/* ========================================
 *  DIALOG STYLES — makeStyles compatible
 * ========================================
 *  For MUI Dialog components.
 * ======================================== */

/** Dialog paper container */
export const dialog = {
	'& .MuiDialog-paper': {
		background: bgMain,
		border: `1px solid ${tealAlpha(0.25)}`,
		boxShadow: `0 0 0 1px ${tealAlpha(0.06)}, 0 24px 80px rgba(0,0,0,0.7)`,
		borderRadius: 8,
		color: textPrimary,
		maxHeight: '85vh',
	},
	'& .MuiBackdrop-root': {
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
};

/** Dialog title bar with flex layout */
export const dialogTitleBar = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '12px 24px',
};

/** Dialog title text (Orbitron) */
export const dialogTitle = {
	fontFamily: fontHeading,
	fontSize: 14,
	fontWeight: 700,
	letterSpacing: '0.1em',
	color: textPrimary,
	padding: '16px 24px',
};

/** Dialog subtitle / description */
export const dialogSubtext = {
	fontSize: 11,
	color: textMuted,
	fontFamily: fontBody,
	marginTop: 2,
};

/** Dialog title with dark bg (DoorLockTool/ElevatorTool variant) */
export const dialogTitleDark = {
	background: 'rgba(0,0,0,0.3)',
	borderBottom: `1px solid ${borderSubtle}`,
	padding: '12px 20px',
	fontSize: 15,
	fontWeight: 600,
	fontFamily: fontHeading,
};

/** Dialog content area */
export const dialogContent = {
	padding: '16px 20px',
	overflowY: 'auto',
};

/** Dialog actions bar (DoorLockTool/ElevatorTool) */
export const dialogActions = {
	padding: '12px 20px',
	borderTop: `1px solid ${borderSubtle}`,
	gap: 8,
};

/** Dialog footer (PedManagement/custom dialogs) */
export const dialogFooter = {
	padding: '12px 24px',
	borderTop: `1px solid ${borderTealLight}`,
	background: 'rgba(10,8,28,0.5)',
	display: 'flex',
	justifyContent: 'flex-end',
	gap: 8,
};


/* ========================================
 *  LAYOUT STYLES — makeStyles compatible
 * ========================================
 *  Common page structure elements.
 * ======================================== */

/** Standard page wrapper */
export const wrapper = {
	padding: '20px 10px 20px 20px',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	fontFamily: fontBody,
};

/** Page header row */
export const header = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	marginBottom: 12,
	flexShrink: 0,
};

/** Header left side with icon + text */
export const headerLeft = {
	display: 'flex',
	alignItems: 'center',
	gap: 12,
};

/** Header right-side action buttons container */
export const headerActions = {
	display: 'flex',
	gap: 8,
	alignItems: 'center',
};

/** Page title (Orbitron) */
export const title = {
	fontSize: 18,
	fontWeight: 600,
	color: textPrimary,
	fontFamily: fontHeading,
};

/** Page subtitle */
export const subtitle = {
	fontSize: 12,
	color: textMuted,
	fontFamily: fontBody,
};

/** Section label / divider heading */
export const sectionLabel = {
	fontFamily: fontBody,
	fontSize: 12,
	fontWeight: 600,
	color: tealAlpha(0.8),
	textTransform: 'uppercase',
	letterSpacing: '0.5px',
	marginTop: 8,
	marginBottom: 8,
};

/** Teal horizontal divider */
export const divider = {
	backgroundColor: borderTealLight,
};

/** Glassmorphic form panel */
export const formPanel = {
	background: bgPanel,
	border: `1px solid ${borderTealLight}`,
	borderRadius: 8,
	padding: 16,
};

/** Flex row for form fields */
export const formRow = {
	display: 'flex',
	gap: 10,
};

/** Stats row */
export const statsRow = {
	display: 'flex',
	gap: 8,
	marginBottom: 12,
	flexWrap: 'wrap',
	flexShrink: 0,
};

/** Filter row */
export const filterRow = {
	display: 'flex',
	gap: 8,
	marginBottom: 12,
	alignItems: 'center',
	flexShrink: 0,
};

/** Table container with border */
export const tableContainer = {
	flex: 1,
	overflowY: 'auto',
	overflowX: 'hidden',
	minHeight: 0,
	background: whiteAlpha(0.02),
	borderRadius: 8,
	border: `1px solid ${borderSubtle}`,
};

/** Small helper text below fields */
export const noteText = {
	fontSize: 10,
	color: 'rgba(255,255,255,0.25)',
	fontFamily: fontBody,
	marginTop: 4,
};

/** Count label above results */
export const countLabel = {
	fontSize: 11,
	color: textDimmed,
	padding: '0 4px 8px',
};


/* ========================================
 *  CHIP STYLES — makeStyles compatible
 * ========================================
 *  Status chips / tags used in tables.
 * ======================================== */

/** Base chip */
export const chip = {
	fontSize: 9,
	fontWeight: 700,
	fontFamily: fontBody,
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
	padding: '2px 8px',
	borderRadius: 8,
	display: 'inline-block',
	marginRight: 4,
	marginBottom: 2,
};

/** Enabled / active chip (teal) */
export const chipEnabled = {
	background: tealAlpha(0.15),
	color: primary,
	border: `1px solid ${tealAlpha(0.3)}`,
};

/** Disabled / inactive chip (muted) */
export const chipDisabled = {
	background: whiteAlpha(0.03),
	color: textDimmed,
	border: `1px solid ${borderSubtle}`,
};

/** Success / active chip (green) */
export const chipSuccess = {
	background: 'rgba(82,152,74,0.15)',
	color: success,
	border: `1px solid rgba(82,152,74,0.3)`,
};

/** Muted / not active chip */
export const chipMuted = {
	background: whiteAlpha(0.03),
	color: textDimmed,
	border: `1px solid ${borderSubtle}`,
};


/* ========================================
 *  SWITCH STYLES — MUI Switch override
 * ======================================== */

export const switchLabel = {
	'& .MuiTypography-root': { fontSize: 13, color: textSecondary },
	'& .MuiSwitch-colorSecondary.Mui-checked': { color: primary },
	'& .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track': { backgroundColor: primary },
};

/** Select dropdown menu styling */
export const selectMenu = {
	'& .MuiPaper-root': {
		background: bgLight,
		border: `1px solid ${borderTeal}`,
		color: textPrimary,
	},
	'& .MuiMenuItem-root': { fontSize: 12 },
};


/* ========================================
 *  EMPTY STATE
 * ========================================
 *  Shown when no results / data found.
 * ======================================== */

export const emptyState = {
	textAlign: 'center',
	padding: '40px 0',
	color: textDimmed,
};

export const emptyIcon = {
	fontSize: 32,
	marginBottom: 12,
	color: tealAlpha(0.3),
};

export const emptyText = {
	fontSize: 14,
	fontWeight: 500,
};


/* ========================================
 *  SCROLLBAR
 * ========================================
 *  Custom teal scrollbar mixin. Spread
 *  into any makeStyles class that scrolls.
 * ======================================== */

export const scrollbar = {
	'&::-webkit-scrollbar': { width: 4 },
	'&::-webkit-scrollbar-thumb': { background: tealAlpha(0.3), borderRadius: 8 },
	'&::-webkit-scrollbar-thumb:hover': { background: primary },
	'&::-webkit-scrollbar-track': { background: 'transparent' },
};


/* ========================================
 *  RESTRICTION / NESTED FORM STYLES
 * ========================================
 *  Shared by DoorLockTool & ElevatorTool
 *  restriction editors.
 * ======================================== */

export const restrictionRow = {
	display: 'flex',
	gap: 8,
	alignItems: 'flex-start',
	marginBottom: 8,
	padding: '8px 10px',
	background: whiteAlpha(0.03),
	borderRadius: 6,
	border: `1px solid rgba(255,255,255,0.05)`,
};

export const restrictionFields = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	gap: 6,
};

export const restrictionFieldRow = {
	display: 'flex',
	gap: 6,
};
