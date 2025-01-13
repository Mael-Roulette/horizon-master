<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Horizon Master - Trouvez votre Master idéal</title>
  <meta name="description"
    content="Explorez et trouvez le Master qui correspond à vos ambitions. Utilisez notre moteur de recherche ou découvrez les établissements grâce à notre carte interactive">

  <?php include "./inc/assets.inc.php" ?>

  <script type="module" src="./scripts/search.js"></script>
</head>

<body>
  <?php include "./inc/header.inc.php" ?>
  <main class="home-main section-inner">
    <div class="home-content">
      <h1 class="home-content-title">Découvrez le master qui vous plaît</h1>
      <div class="home-content-search">
        <form class="home-content-search-form" id="searchForm">
          <label for="searchInput">Rechercher par mots-clés, établissement, ...</label>
          <input type="search" name="searchInput" id="searchInput" placeholder="Rechercher...">
          <button type="submit" class="button" id="searchButton" aria-label="Rechercher avec la carte interactive des masters">Rechercher</button>
        </form>
      </div>
      <a href="map.php" class="link">Rechercher avec la carte des masters</a>
    </div>
    <div class="home-image">
      <img src="./imgs/page-accueil-fond.webp" alt="Étudiants en recherche d'un master">
    </div>
  </main>
  <?php include "./inc/cookie.inc.php" ?>
  <?php include "./inc/footer.inc.php" ?>
</body>

</html>