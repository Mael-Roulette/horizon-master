<link rel="icon" type="image/x-icon" href="./imgs/favicon/favicon.ico"/>

<link rel="stylesheet" href="./css/style.css">
<script src="https://kit.fontawesome.com/aa3d4234d6.js" crossorigin="anonymous"></script>

<script>
    if (!HTMLScriptElement?.supports?.("importmap")) {
        alert('Votre navigateur ne supporte pas cette application web');
    }
</script>
<script type="importmap">
    {
      "imports": {
        "network": "./modules/network.js",
        "storage": "./modules/storage.js",
        "viz/preprocessor": "./modules/vizDataPreprocessor.js",
        "viz/pieRatioMWChart": "./modules/vizPieRatioMW.js",
        "viz/pieAcceptMWChart": "./modules/vizPieAcceptMW.js",
        "viz/webChartRecap": "./modules/vizWebChartRecap.js",
        "viz/barProvenance": "./modules/vizBarProvenance.js",
        "viz/linePro": "./modules/vizLinePro.js",
        "displayResult": "./scripts/displayResult.js",
        "swiper": "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs"
      }
    }
</script>
<script type="module" src="./scripts/main.js" defer></script>
<script type="module" src="./scripts/cookie.js" defer></script>
<script type="module" src="./scripts/addFavorites.js" defer></script>