document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('url-builder-form');
  const output = document.getElementById('url-display');
  const iframe = document.getElementById('live-preview');
  const iframeCode = document.getElementById('iframe-code');

  const stripHash = (color) => color.startsWith('#') ? color.substring(1) : color;

  const updateURL = () => {
    const txt = stripHash(document.getElementById('text').value);
    const colorTxt = stripHash(document.getElementById('color-txt').value);
    const colorBorder = stripHash(document.getElementById('color-border').value);
    const colorBg = stripHash(document.getElementById('color-bg').value);
    const font = document.getElementById('font').value;
    const fontWeight = document.getElementById('font-weight').value;
    const fontSize = document.getElementById('font-size').value;
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;

    const params = new URLSearchParams({
      'text':txt,
      'color-txt': colorTxt,
      'color-border': colorBorder,
      'color-bg': colorBg,
      'font': font,
      'font-weight': fontWeight,
      'font-size': fontSize,
      'width': width,
      'height': height
    });

    const urlWithParams = `https://hellkaiser45.github.io/Notion-widgets/simple-banner/index.html?${params.toString()}`;
    output.textContent = `${urlWithParams}`;
    iframe.src = urlWithParams;
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframeCode.textContent = `<iframe src="${urlWithParams}" style="width: ${width}px; height: ${height}px; border: none;"></iframe>`;
  };

  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateURL);
    input.addEventListener('change', updateURL);
  });

  updateURL();
});

document.addEventListener('DOMContentLoaded', () => {
  // Select all buttons with class 'copy-button'
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', function() {
      // Retrieve the ID of the target element from the button's data attribute
      const targetId = this.getAttribute('data-target');
      const textToCopy = document.getElementById(targetId).textContent || document.getElementById(targetId).value;

      navigator.clipboard.writeText(textToCopy).then(() => {
        this.classList.add('copied');
        setTimeout(() => {
          this.classList.remove('copied');
        }, 2500);
      }).catch(err => {
        console.error('Failed to copy text:', err);
      });
    });
  });

});
