<header>
  <div class="header-content section-inner">
    <div class="header-content-menu">
      <a href="./" aria-label="Retour à la page d'accueil">
        <img src="./imgs/logo/logo_blanc.png" alt="Horizon Master" class="header-content-menu-logo"></img>
      </a>
      <i class="header-content-menu-i fa-solid fa-bars" aria-label="Menu de navigation" tabindex="0"  role="button"></i>
    </div>
    <nav class="header-content-nav" role="navigation">
      <ul class="header-content-nav-list">
        <li class="header-content-nav-list-item">
          <a href="map.php" class="header-content-nav-list-item-link" aria-label="Accéder à la carte des masters">Carte des masters</a>
        </li>
        <li class="header-content-nav-list-item">
          <button class="header-content-nav-list-item-link" id="popup-favori" aria-label="Voir vos favoris">Favoris</button>
        </li>
        <li class="header-content-nav-list-item">
          <a href="#footer" class="header-content-nav-list-item-link" aria-label="Contactez-nous"<>Contact</a>
        </li>
      </ul>
    </nav>
  </div>
</header>

<div id="overlay" class="overlay" aria-hidden="true"></div>
<section class="popup-favori" id="favori" role="dialog" aria-labelledby="favoriTitle" aria-hidden="true">
  <h2 class="popup-favori-title">Vos favoris</h2>
  <button type="button" class="popup-favori-close" id="close-favori" aria-label="Fermer la fenêtre des favoris">
    <svg viewBox="0 0 30 31" fill="#F2F2F2" xmlns="http://www.w3.org/2000/svg">
      <path d="M29.1121 5.50192C30.2835 4.33059 30.2835 2.42836 29.1121 1.25703C27.9408 0.085709 26.0386 0.085709 24.8673 1.25703L15 11.1337L5.12338 1.2664C3.95205 0.0950794 2.04982 0.0950794 0.878493 1.2664C-0.292831 2.43773 -0.292831 4.33996 0.878493 5.51129L10.7551 15.3785L0.887864 25.2552C-0.28346 26.4265 -0.28346 28.3287 0.887864 29.5C2.05919 30.6714 3.96142 30.6714 5.13275 29.5L15 19.6234L24.8766 29.4907C26.0479 30.662 27.9502 30.662 29.1215 29.4907C30.2928 28.3194 30.2928 26.4171 29.1215 25.2458L19.2449 15.3785L29.1121 5.50192Z" fill="black" />
    </svg>
  </button>

  <div class="favorite-container"></div>
  <p class="popup-favori-warning" id="warningFavori">Attention ! Vos favoris ne sont sauvegardés que sur cet ordinateur !</p>
</section>