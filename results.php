<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Horizon Master | 0 résultats trouvés</title> <!-- mettre le nombre de résultats trouvés avec un count() -->

  <?php include("./inc/assets.inc.php"); ?>
  <script type="module" src="./scripts/displayResult.js" defer></script>
  <script type="module" src="./scripts/search.js" defer></script>
  <script src="./scripts/filtres.js" type="module" defer></script>
</head>

<body>
  <?php include("./inc/header.inc.php"); ?>
  <main class="results-main">
    <aside class="filter-wrapper">
      <div class="filter-content">
        <div class="filter-title">
          <p>Filtres</p>
          <i class="result-content-filter-i fa-solid fa-filter" aria-hidden="true"></i>
        </div>
        <ul class="filter-list">
          <li class="filter-list-item">
            <div class="filter-list-item-group">
              <p>Mention</p>
              <i class="filter-list-i fa-solid fa-chevron-down" aria-hidden="true"></i>
            </div>
            <div class="search-wrapper contenu">
              <form class="search-wrapper-form" id="searchForm">
                <input class="search-wrapper-form-input" type="search" name="mention"
                  id="searchMentionInput"
                  placeholder="Rechercher...">
              </form>
            </div>
          </li>
          <li class="filter-list-item">
            <div class="filter-list-item-group">
              <p>Taux d'insertion (en %)</p>
              <i class="filter-list-i fa-solid fa-chevron-down" aria-hidden="true"></i>
            </div>
            <div class="slider-container contenu">
              <input type="range" min="0" max="100" value="50" id="slider" name="nbPlaces">
              <div class="labels">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </li>
          <li class="filter-list-item">
            <div class="filter-list-item-group">
              <p>Région</p>
              <i class="filter-list-i fa-solid fa-chevron-down" aria-hidden="true"></i>
            </div>
            <div class="filter-list-item-region contenu">
              <select name="regionName" id="region" class="filter-list-item-region-select">
                <option value="">Toutes les régions</option>
                <option value="Île-de-France">Île-de-France</option>
                <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
                <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
                <option value="Occitanie">Occitanie</option>
                <option value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d'Azur</option>
                <option value="Grand Est">Grand Est</option>
                <option value="Hauts-de-France">Hauts-de-France</option>
                <option value="Bretagne">Bretagne</option>
                <option value="Normandie">Normandie</option>
                <option value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</option>
                <option value="Centre-Val de Loire">Centre-Val de Loire</option>
                <option value="Pays de la Loire">Pays de la Loire</option>
                <option value="Corse">Corse</option>
                <option value="Guadeloupe">Guadeloupe</option>
                <option value="Martinique">Martinique</option>
                <option value="Guyane">Guyane</option>
                <option value="La Réunion">La Réunion</option>
                <option value="Mayotte">Mayotte</option>
              </select>
            </div>
          </li>
          <button class="filter-button button-primary">Filtrer</button>
        </ul>
      </div>
    </aside>
    <div class="recherche search-wrapper section-inner">
      <form class="search-wrapper-form" id="searchForm">
        <label for="searchInput">Rechercher par mots-clés, établissement, ...</label>
        <div class="search-wrapper-form-container">
          <input class="search-wrapper-form-input" type="search" name="recherche" id="searchInput"
            placeholder="Rechercher...">
          <button type="submit" class="button-primary search-wrapper-form-btn" id="searchButton">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </form>
      <a href="map.php" class="link">Rechercher avec la carte des masters</a>
    </div>
    <section class="result-wrapper section-inner">

    </section>
  </main>
  <?php include "./inc/cookie.inc.php" ?>
  <?php include("./inc/footer.inc.php"); ?>
</body>

</html>