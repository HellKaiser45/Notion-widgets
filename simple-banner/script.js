// Function to retrieve URL parameters and return them as an object


const params = getURLParameters();
const apply = applyParameters(params);

function getURLParameters() {
  const queryString = window.location.search;
  console.log("Query string:", queryString);
  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    urlParams.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
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
  link.onload = () => {
    console.log(`Police ${fontName} chargée avec succès.`);
  };
  link.onerror = () => {
    console.error(`Erreur lors du chargement de la police ${fontName}.`);
  };
  document.head.appendChild(link);
}

function applyParameters(params) {
  const root = document.documentElement;

  if (!params) {
    console.warn("Aucun paramètre à appliquer.");
    return;
  }

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
    if (key==='text'){
      const header = document.getElementById('headerText');
      header.textContent = value;
    }
    root.style.setProperty(`--${key}`, value);
    document.getElementById('svgContainer').style.setProperty('display','flex')
    console.log(`--${key} appliqué avec la valeur: ${value}`);
    console.log(`Header text changed to: ${value}`);
  });
}
// Execute when the page loads
