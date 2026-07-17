/**
 * SIPP Theme Configuration
 * Single source of truth for all design decisions
 * Used throughout the application for consistency
 */

export const THEME = {
  // ============================================
  // COLORS
  // ============================================
  colors: {
    primary: {
      light: '#9FE7F5',
      DEFAULT: '#429EBD',
      dark: '#053F5C',
      50: '#F0F9FC',
      100: '#D9F0F7',
      200: '#9FE7F5',
      300: '#6BCDE3',
      400: '#429EBD',
      500: '#2E7D99',
      600: '#1F5D75',
      700: '#053F5C',
      800: '#042C40',
      900: '#031A26',
    },
    accent: {
      yellow: '#F7AD19',
      orange: '#F27F0C',
      50: '#FEF9E7',
      100: '#FDF0C4',
      200: '#F7AD19',
      300: '#E69A0F',
      400: '#CC8708',
      500: '#B37500',
    },
    background: {
      DEFAULT: '#FFFFFF',
      light: '#F8FAFC',
      dark: '#0F172A',
      muted: '#F1F5F9',
    },
    text: {
      primary: '#053F5C',
      secondary: '#4A5568',
      muted: '#A0AEC0',
      white: '#FFFFFF',
      dark: '#1A202C',
    },
    status: {
      success: '#48BB78',
      warning: '#ED8936',
      error: '#FC8181',
      info: '#63B3ED',
    },
    border: {
      light: '#E2E8F0',
      DEFAULT: '#CBD5E0',
      dark: '#A0AEC0',
    },
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    fontFamily: {
      primary: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace",
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    fontSize: {
      xxs: '0.625rem',   // 10px
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
      '8xl': '6rem',     // 96px
      '9xl': '8rem',     // 128px
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // ============================================
  // SPACING
  // ============================================
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    18: '4.5rem',     // 72px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
  },

  // ============================================
  // BORDER RADIUS
  // ============================================
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // ============================================
  // SHADOWS
  // ============================================
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
    medium: '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 12px 30px -4px rgba(0, 0, 0, 0.05)',
    strong: '0 8px 30px -4px rgba(0, 0, 0, 0.10), 0 20px 40px -8px rgba(0, 0, 0, 0.06)',
    glow: '0 0 40px rgba(66, 158, 189, 0.15)',
    card: '0 2px 8px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)',
    'card-hover': '0 4px 16px rgba(0, 0, 0, 0.06), 0 12px 32px rgba(0, 0, 0, 0.08)',
  },

  // ============================================
  // TRANSITIONS
  // ============================================
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
    slower: '500ms ease-in-out',
    slowest: '750ms ease-in-out',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // ============================================
  // BREAKPOINTS
  // ============================================
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
  },

  // ============================================
  // CONTAINERS
  // ============================================
  containers: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ============================================
  // Z-INDEX
  // ============================================
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
    max: 9999,
  },

  // ============================================
  // GRID
  // ============================================
  grid: {
    gap: '1.5rem',
    columns: 12,
  },

  // ============================================
  // SECTION PADDING
  // ============================================
  section: {
    padding: '5rem',
    paddingSm: '3rem',
    paddingLg: '8rem',
  },

  // ============================================
  // BORDER WIDTHS
  // ============================================
  borderWidth: {
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
};

// ============================================
// EXPORT HELPERS
// ============================================

/**
 * Get color by path
 * @param {string} path - Color path (e.g., 'primary.DEFAULT')
 * @returns {string} Color value
 */
export const getColor = (path) => {
  const parts = path.split('.');
  let value = THEME.colors;
  for (const part of parts) {
    if (value && value[part] !== undefined) {
      value = value[part];
    } else {
      return undefined;
    }
  }
  return value;
};

/**
 * Get spacing by key
 * @param {string|number} key - Spacing key
 * @returns {string} Spacing value
 */
export const getSpacing = (key) => {
  return THEME.spacing[key] || key;
};

/**
 * Get shadow by key
 * @param {string} key - Shadow key
 * @returns {string} Shadow value
 */
export const getShadow = (key) => {
  return THEME.shadows[key] || THEME.shadows.base;
};

/**
 * Get transition by key
 * @param {string} key - Transition key
 * @returns {string} Transition value
 */
export const getTransition = (key) => {
  return THEME.transitions[key] || THEME.transitions.base;
};

/**
 * Get breakpoint by key
 * @param {string} key - Breakpoint key
 * @returns {string} Breakpoint value
 */
export const getBreakpoint = (key) => {
  return THEME.breakpoints[key] || THEME.breakpoints.md;
};

export default THEME;