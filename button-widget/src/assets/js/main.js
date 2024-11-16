// Function to load Google Font dynamically
const loadGoogleFont = (fontFamily) => {
  // Skip if it's a system font
  if (['sans-serif', 'serif', 'monospace', 'Arial', 'Helvetica', 'Times New Roman'].includes(fontFamily)) {
    return Promise.resolve();
  }

  // Convert font family name to Google Fonts format (replace spaces with +)
  const googleFontName = fontFamily.replace(/\s+/g, '+');

  return new Promise((resolve, reject) => {
    // Create link element for Google Fonts
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${googleFontName}&display=swap`;
    link.rel = 'stylesheet';

    link.onload = resolve;
    link.onerror = reject;

    document.head.appendChild(link);
  });
};

// Function to get URL parameters with default values
const getButtonParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    text: decodeURIComponent(params.get('text') || 'Click me'),
    bgColor: params.get('bgColor') || '#570DF8', // daisy default primary color
    bgOpacity: params.get('bgOpacity') || '1',
    border: params.get('border') === 'true',
    borderColor: params.get('borderColor') || '#000000',
    fontSize: params.get('fontSize') || '16',
    fontFamily: params.get('fontFamily') || 'sans-serif',
    textColor: params.get('textColor') || '#ffffff'
  };
};

// Function to apply parameters to button
const applyButtonStyles = async () => {
  const button = document.getElementById('customButton');
  const params = getButtonParams();

  // Load Google Font if specified
  try {
    await loadGoogleFont(params.fontFamily);
  } catch (error) {
    console.warn('Failed to load Google Font:', error);
    // Fallback to sans-serif if font loading fails
    params.fontFamily = 'sans-serif';
  }

  // Convert hex color and opacity to rgba for background
  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Apply styles
  button.textContent = params.text;
  button.style.backgroundColor = hexToRgba(params.bgColor, params.bgOpacity);
  button.style.border = params.border ? `2px solid ${params.borderColor}` : 'none';
  button.style.fontSize = `${params.fontSize}px`;
  button.style.fontFamily = `"${params.fontFamily}", sans-serif`;
  button.style.color = params.textColor;
};

// Apply styles when the page loads
window.addEventListener('DOMContentLoaded', applyButtonStyles);
