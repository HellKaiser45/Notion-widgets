document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('url-builder-form');
  const output = document.getElementById('url-display');
  const iframe = document.getElementById('live-preview');
  const iframeCode = document.getElementById('iframe-code');
  const darkModeToggle = document.getElementById('darkmode');
  const svgDarkMode = document.getElementById('svgDarkmode');

  /**
   * Removes the leading hash from a hex color string if present.
   * @param {string} color - The color string to process.
   * @returns {string} The color string without the leading hash.
   */
  const stripHash = (color) => color.startsWith('#') ? color.substring(1) : color;

  /**
   * Updates the URL with the form input parameters and updates the iframe and embed code.
   */
  const updateURL = () => {
    const params = new URLSearchParams({
      'text': document.getElementById('text').value,
      'color-txt': stripHash(document.getElementById('color-txt').value),
      'color-border': stripHash(document.getElementById('color-border').value),
      'color-bg': stripHash(document.getElementById('color-bg').value),
      'font': document.getElementById('font').value,
      'font-weight': document.getElementById('font-weight').value,
      'font-size': document.getElementById('font-size').value,
      'width': document.getElementById('width').value,
      'height': document.getElementById('height').value
    });
    const urlWithParams = `https://hellkaiser45.github.io/Notion-widgets/simple-banner/index.html?${params.toString()}`;
    output.textContent = urlWithParams;
    iframe.src = urlWithParams;
    iframe.style.width = `${params.get('width')}px`;
    iframe.style.height = `${params.get('height')}px`;
    iframeCode.textContent = `<iframe src="${urlWithParams}" style="width: ${params.get('width')}px; height: ${params.get('height')}px; border: none;"></iframe>`;
  };

  /**
   * Attaches input and change event listeners to all input elements in the form to trigger URL updates.
   */
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateURL);
    input.addEventListener('change', updateURL);
  });

  // Initial call to update URL when the page loads
  updateURL();

  /**
   * Attaches a click event listener to all copy buttons to copy the content of the target element to the clipboard.
   */
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const textToCopy = document.getElementById(targetId).textContent || document.getElementById(targetId).value;

      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          this.classList.add('copied');
          setTimeout(() => this.classList.remove('copied'), 2500);
        })
        .catch(err => console.error('Failed to copy text:', err));
    });
  });

  /**
   * Sets the current theme (light or dark) and updates the icon and cookie accordingly.
   * @param {string} theme - The theme to apply ('light' or 'dark').
   */
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    svgDarkMode.setAttribute('src', theme === 'dark'
      ? 'https://api.iconify.design/line-md:moon-rising-twotone-loop.svg'
      : 'https://api.iconify.design/line-md:moon-filled-alt-to-sunny-filled-loop-transition.svg'
    );
    document.cookie = `mode=${theme}`;
  };

  /**
   * Retrieves the value of a specified cookie.
   * @param {string} name - The name of the cookie to retrieve.
   * @returns {string|null} The value of the cookie, or null if not found.
   */
  const getCookieValue = (name) => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
    return cookie ? cookie.split('=')[1] : null;
  };

  // Check for saved theme in cookies or use system preference
  const savedTheme = getCookieValue('mode');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  // Add click event listener to toggle theme when the dark mode button is clicked
  darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
});
