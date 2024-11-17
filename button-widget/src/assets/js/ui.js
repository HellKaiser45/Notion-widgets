function updatePreview() {
  const form = document.getElementById('configForm');
  const previewFrame = document.getElementById('buttonPreview');
  const urlDisplay = document.getElementById('urlDisplay');

  // Get all form values
  const text = encodeURIComponent(form.buttonText.value || 'Click me');
  const bgColor = form.bgColor.value;
  const bgOpacity = form.bgOpacity.value;
  const border = form.border.checked;
  const borderColor = form.borderColor.value;
  const fontSize = form.fontSize.value;
  const fontFamily = encodeURIComponent(form.fontFamily.value);
  const textColor = form.textColor.value;

  // Construct URL

  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    text,
    bgColor,
    bgOpacity,
    border,
    borderColor,
    fontSize,
    fontFamily,
    textColor
  });

  const fullUrl = `${baseUrl}?${params.toString()}`;


  // Update iframe and URL display
  previewFrame.src = fullUrl;
  urlDisplay.value = fullUrl;
}

function copyUrl() {
  const urlDisplay = document.getElementById('urlDisplay');
  urlDisplay.select();
  navigator.clipboard.writeText(urlDisplay.value).then(() => {
    // Show copy feedback
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

// Update preview when the page loads
window.addEventListener('DOMContentLoaded', updatePreview);
