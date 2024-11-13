// Optimize performance with efficient DOM operations and resource loading
document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements
  const elements = {
    form: document.getElementById('url-builder-form'),
    output: document.getElementById('url-display'),
    iframe: document.getElementById('live-preview'),
    iframeCode: document.getElementById('iframe-code'),
    darkModeToggle: document.getElementById('darkmode'),
    svgDarkMode: document.getElementById('svgDarkmode')
  };

  // Preconnect to external resources
  const preconnectUrls = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://api.iconify.design'
  ];

  preconnectUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
  });

  // Lazy load non-critical resources
  const lazyLoadScripts = () => {
    const scriptUrls = [
      '/assets/js/jscolor.min.js'
    ];

    scriptUrls.forEach(url => {
      const script = document.createElement('script');
      script.src = url;
      script.defer = true;
      document.body.appendChild(script);
    });
  };

  // Optimize performance with requestAnimationFrame
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Efficient URL updating
  const updateURL = debounce(() => {
    const formData = new FormData(elements.form);
    const params = new URLSearchParams();

    // Explicitly add text parameter
    const textInput = document.getElementById('text');
    if (textInput) {
      params.append('text', textInput.value);
    }

    for (const [key, value] of formData.entries()) {
      params.append(key, value.startsWith('#') ? value.substring(1) : value);
    }

    const urlWithParams = `${window.location.origin}?${params.toString()}`;

    requestAnimationFrame(() => {
      elements.output.textContent = urlWithParams;
      elements.iframe.src = urlWithParams;
      elements.iframe.style.width = `${params.get('width')}px`;
      elements.iframe.style.height = `${params.get('height')}px`;
      elements.iframeCode.textContent =
        `<iframe src="${urlWithParams}" style="width: ${params.get('width')}px; height: ${params.get('height')}px; border: none;"></iframe>`;
    });
  }, 150);

  // Event delegation for form inputs
  elements.form.addEventListener('input', updateURL);

  // Optimize theme switching
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    elements.svgDarkMode.setAttribute('src',
      theme === 'dark'
        ? 'https://api.iconify.design/line-md:moon-rising-twotone-loop.svg'
        : 'https://api.iconify.design/line-md:moon-filled-alt-to-sunny-filled-loop-transition.svg'
    );
    localStorage.setItem('theme', theme);
  };

  // Use localStorage instead of cookies for better performance
  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(savedTheme);

  // Optimize copy functionality
  const copyButtons = document.querySelectorAll('.copy-button');
  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      const text = document.getElementById(targetId).textContent;
      navigator.clipboard.writeText(text)
        .then(() => {
          button.classList.add('copied');
          setTimeout(() => button.classList.remove('copied'), 2500);
        });
    });
  });

  // Initialize
  updateURL();
  lazyLoadScripts();
});
