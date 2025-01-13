<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Horizon Master - Explorez les mentions par région</title>
    <meta name="description"
          content="Utilisez notre carte interactive pour rechercher les mentions de Master disponibles dans chaque région. Découvrez les établissements et leurs formations en un clic.">

    <?php include "./inc/assets.inc.php" ?>
</head>

<body>
<?php include "./inc/header.inc.php" ?>

  <main class="section-inner map-main">
    <section class="map-content-wrapper">
      <h1 class="map-title">Rechercher avec la carte</h1>
      <div id="displayMap" class="map-display" aria-label="Carte interactive pour explorer les mentions de Master par région"></div>

      <div class="map-result" id="mapResult">
        <div class="map-result-content">
          <h2>Mentions de la région</h2>
          <div class="map-result-list" aria-live="polite">
            <p>Aucune région sélectionnée</p>
          </div>
        </div>

        <a href="/" class="link">Rechercher par mots clés</a>
      </div>
    </section>

    <section class="map-recent-searches" id="recentSearches">
      <h2 class="map-recent-searches-title">Recherches récentes</h2>
      <ul class="map-recent-searches-list" aria-live="polite">
        <li>Aucune recherche récente</li>
      </ul>
    </section>
  </main>

<?php include "./inc/cookie.inc.php" ?>
<?php include "./inc/footer.inc.php" ?>

<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
<script type="module" src="./scripts/displayMap.js" defer></script>
</body>

</html>