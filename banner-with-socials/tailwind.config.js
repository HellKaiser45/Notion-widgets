/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      {
      mylighttheme: {
        "font-family": "'Share Tech Mono', 'Space Mono', monospace",

        "primary": "#e6eaef", // Light input background, good for contrast with dark text.
        "primary-content": "#000000", // Black text for primary content.

        "secondary": "#454c54", // Dark border color, suitable for headings or accents.
        "secondary-content": "#ffffff", // White text for "secondary" background.

        "accent": "#03a9f4", // Bright blue accent, high contrast on light backgrounds.
        "accent-content": "#ffffff", // White text for accent backgrounds.

        "neutral": "#9e9e9e", // Mid-tone gray for balanced backgrounds.
        "neutral-content": "#000000", // Black text for neutral background.

        "base-100": "#ffffff", // Main page background, white.
        "base-content": "#000000", // Black text for base content.

        "info": "#03a9f4", // Bright info color.
        "info-content": "#ffffff", // White text on info background.

        "success": "#7dd8ac", // Green for success notifications.
        "success-content": "#000000", // Dark text for success background.

        "warning": "#f57c00", // Bright orange warning color.
        "warning-content": "#ffffff", // White text for warning background.

        "error": "#c62828", // Red for error notifications.
        "error-content": "#ffffff", // White text for error background.

        "--rounded-box": "1rem", // Rounded corners for large elements.
        "--rounded-btn": "0.5rem", // Rounded corners for buttons.
        "--rounded-badge": "1.9rem", // Rounded corners for badges.
        "--animation-btn": "0.25s", // Button click animation.
        "--animation-input": "0.2s", // Input animation.
        "--btn-focus-scale": "0.95", // Button scale on focus.
        "--border-btn": "1px", // Button border width.
        "--tab-border": "1px", // Tab border width.
        "--tab-radius": "0.5rem", // Tab border radius.
        },
        mydarktheme: {
        "font-family": "'Share Tech Mono', 'Space Mono', monospace",

        "primary": "#191510", // Dark input color.
        "primary-content": "#ffffff", // White text for primary content.

        "secondary": "#bab3ab", // Light beige for secondary elements.
        "secondary-content": "#000000", // Black text for secondary background.

        "accent": "#03a9f4", // Bright blue accent color for contrast.
        "accent-content": "#ffffff", // White text for accent background.

        "neutral": "#303046", // Dark neutral color.
        "neutral-content": "#ffffff", // White text for neutral background.

        "base-100": "#000000", // Black for main background.
        "base-content": "#ffffff", // White text for main content.

        "info": "#0288d1", // Info color, bright blue.
        "info-content": "#ffffff", // White text on info background.

        "success": "#7dd8ac", // Green for success messages.
        "success-content": "#000000", // Black text for success background.

        "warning": "#f57c00", // Bright orange warning color.
        "warning-content": "#ffffff", // White text for warning background.

        "error": "#c62828", // Deep red for error messages.
        "error-content": "#ffffff", // White text for error background.

        "--rounded-box": "1rem", // Rounded corners for large elements.
        "--rounded-btn": "0.5rem", // Rounded corners for buttons.
        "--rounded-badge": "1.9rem", // Rounded corners for badges.
        "--animation-btn": "0.25s", // Button click animation.
        "--animation-input": "0.2s", // Input animation.
        "--btn-focus-scale": "0.95", // Button scale on focus.
        "--border-btn": "1px", // Button border width.
        "--tab-border": "1px", // Tab border width.
        "--tab-radius": "0.5rem", // Tab border radius.
      },
    },
    ],
  },
  darkMode: ['class', '[data-theme="mydarktheme"]']
};
