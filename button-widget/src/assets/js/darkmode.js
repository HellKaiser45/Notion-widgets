document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('theme-toggle');
  const theme = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Check for existing cookie
  const cookie = document.cookie;
  const mode = cookie.split(';').find(item => item.trim().startsWith('mode='));

  if (checkbox) {
    if (mode) {
      checkbox.checked = mode.trim() === 'mode=dark';
    } else {
      checkbox.checked = theme;
    }

    // Add event listener only if checkbox exists
    checkbox.addEventListener('change', () => {
      document.cookie = `mode=${checkbox.checked ? 'dark' : 'light'}; SameSite=Strict; Secure`;
    });
  }
});
