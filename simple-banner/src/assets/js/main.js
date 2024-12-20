// Function to retrieve URL parameters and return them as an object

function getURLParameters() {
  const queryString = window.location.search;

  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    return urlParams;
  } else {
    return null;
  }
}

// Mapping of URL parameters to CSS variables
function importGoogleFont(fontName) {
  if (!fontName) return;

  // Remplace les espaces par des plus (+) pour l'URL
  const formattedFontName = fontName.replace(/ /g, '+');

  // Crée l'URL pour importer la police depuis Google Fonts
  const fontURL = `https://fonts.googleapis.com/css2?family=${formattedFontName}&display=swap`;

  // Crée un élément <link> et l'ajoute au <head>
  const link = document.createElement('link');
  link.href = fontURL;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

function applyParameters(params) {
  const root = document.documentElement;


  params.forEach((value, key) => {
    // Vérifie si la clé commence par 'color-' pour déterminer si c'est une couleur
    if (key.startsWith('color-')) {
      if (!value.startsWith('#')) {
        value = `#${value}`;
      }
    }
    if (key === 'font') {
      importGoogleFont(value);
    }
    if (key === 'font-size') {
      value = `${value}px`;
    }
    if (key === 'text') {
      const header = document.getElementById('headerText');
      header.textContent = value;
    }
    root.style.setProperty(`--${key}`, value);
    document.getElementById('svgContainer').style.setProperty('display', 'flex')
  });
}
// Execute when the page loads
function updateUIOnParameterChange() {
  const params = getURLParameters();
  applyParameters(params);
}

window.addEventListener("popstate", (event) => {
  const params = getURLParameters();
  applyParameters(params);
});
// Call the function to handle parameters when the page loads
window.addEventListener('load', updateUIOnParameterChange);
