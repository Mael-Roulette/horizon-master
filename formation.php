<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Formation</title>

  <?php include "./inc/assets.inc.php" ?>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11.2.0/swiper-bundle.min.css">
</head>

<body>
  <?php include "./inc/header.inc.php" ?>
  <main class="main-formation">
    <div class="retour-wrapper">
      <button class="retour-resultat-btn " data-formationid>
        <i class="fa-solid fa-arrow-left" aria-label="Bouton retour" tabindex="0"></i>
      </button>
    </div>
    <section class="informations-wrapper section-inner">
      <div class="informations-content">
        <div class="informations-content-text">
          <h1 id="parcoursFormation"> Nom de la formation</h1>
          <h2 id="secDiscFormation">Nom du domaine de formation</h2>
          <p id="alternanceFormation">Modalités d'enseignement : <span>Initiale, Continue, Hybride</span></p>
        </div>
        <button class="informations-favorite-btn" data-formationid>
          <svg viewBox="-5 -5 470 630" xmlns="http://www.w3.org/2000/svg" style="transform: scale(1.5);">
            <path d="M2.5 595.647V56.25C2.5 26.5643 26.5643 2.5 56.25 2.5H393.75C423.436 2.5 447.5 26.5643 447.5 56.25V595.647L226.26 466.591L225 465.856L223.74 466.591L2.5 595.647Z"
              fill="transparent" stroke="#3F433D" stroke-width="10" />
          </svg>
        </button>
      </div>
    </section>

    <section class="recap-wrapper section-inner">
      <h2 class="recap-titre"> Informations de l'année 2023 </h2>
      <div class="recap-2023">
        <div class="recap-infos">
          <p class="recap-donnees" id="nbPlace"> 0 </p>
          <p class="recap-description"> Nombre de places </p>
        </div>
        <div class="recap-infos">
          <p class="recap-donnees" id="lastAccepted"> 0 </p>
          <p class="recap-description"> Rang du dernier accepté </p>
        </div>
        <div class="recap-infos">
          <p class="recap-donnees" id="nbApplication"> 0 </p>
          <p class="recap-description"> Nombre de candidatures </p>
        </div>
      </div>
    </section>


    <section class="graphviz-wrapper">
      <div class="graphviz-tab-container section-inner">
        <div class="graphviz-tab active-tab">
          <span>Candidature</span>
        </div>
        <div class="graphviz-tab">
          <span>Insertion</span>
        </div>
      </div>
      <div class="graphviz-content-wrapper">
        <div class="graphviz-content section-inner" aria-live="polite">

          <div class="graphviz-content-application graphviz-content-tab display-tab" role="tab"
            aria-selected="true" aria-controls="candidature-tab">
            <h3 class="graphviz-content-application-title">Statistiques des candidatures</h3>
            <div class="graphviz-content-application-container">
              <div class="chart" id="pieChartHF" aria-label="Statistiques des candidatures par sexe."></div>
              <div class="chart" id="acceptMWPieChart"
                aria-label="Statistiques des admissions par sexe."></div>
            </div>
            <div class="chart" id="barProvenance" aria-label="Statistiques des candidatures par secteur"></div>
          </div>

          <div class="graphviz-content-insertion graphviz-content-tab" role="tab" aria-selected="false"
            aria-controls="insertion-tab">
            <h3 class="graphviz-content-insertion-title">Statistiques des insertions professionnelles</h3>
            <div class="chart" id="lineChart" aria-label="Statistiques des salaires par année."></div>
          </div>

        </div>
      </div>
    </section>

    <section class="localisation-wrapper section-inner">
      <div class="localisation-infos">
        <h2>Localisation</h2>
        <p id="localisationFormation">Localisation de la formation</p>
      </div>
      <div id="map" style="width: 100%; height: 400px;"
        aria-label="Carte interactive montrant la localisation de la formation"></div>
    </section>

    <section class="formation-similar-wrapper">
      <div class="formation-similar-content section-inner">
        <h2 class="formation-similar-content-title">Formations similaires</h2>
        <div class="swiper swiper-container">
          <div class="swiper-wrapper">

          </div>
          <!-- Flèches de navigation -->
          <div class="swiper-button-navigation">
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
          </div>
        </div>
      </div>
    </section>
  </main>


  <?php include "./inc/cookie.inc.php" ?>
  <?php include "./inc/footer.inc.php" ?>

  <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
  <script type="module" src="./scripts/formation.js" defer></script>
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>

</body>

</html>