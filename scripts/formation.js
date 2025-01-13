import { get } from "storage";
import { initFavorite } from "./addFavorites.js";
import { createVizBarProvenance, updateVizBarProvenance } from "viz/barProvenance";
import { createVizPieRatioFH, updateVizPieRatioFH } from "viz/pieRatioMWChart";
import { createVizPieAcceptMW, updateVizPieAcceptMW } from "viz/pieAcceptMWChart";
import { createWebChartRecap, updateWebChartRecap } from "viz/webChartRecap";
import { createVizLinePro, updateVizLinePro } from "viz/linePro";
import { requestStats } from "network";

// core version + navigation, pagination modules:
import Swiper from 'swiper';

mapboxgl.accessToken = "pk.eyJ1IjoibWFlbHIiLCJhIjoiY200eDlncnFiMGw4MzJqcXY5bGwydnE3byJ9.NCk04kpX-LbqjiklIkg5-Q";

"use strict";

document.addEventListener( "DOMContentLoaded", initFormation );

/**
 * Permet d'initialiser la page de formation
 */
function initFormation () {
  const urlParams = new URLSearchParams( window.location.search );
  const uniqueFormation = urlParams.get( "ifc" );

  fetch( `https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/formations/${ uniqueFormation }` )
    .then( ( res ) => {
      if ( !res.ok ) {
        throw new Error( `Erreur lors du chargement de la formation (code ${ res.status })` );
      }
      return res.json();
    } )
    .then( ( formation ) => {
      displayFormation( formation ); // Affichage des infos de la formation
      displayProvenanceChart( formation ); // Récupération et affichage des données de provenance
      displayPieMWChart( formation ); // Récupération et affichage des données de répartition homme/femme
      displayPieAcceptMWChart( formation ); // Récupération et affichage des données d'acceptation homme/femme
      displayRadarRecapChart( formation ); // Récupération et affichage des données de récapitulatif
      displayInserPro( formation ); // Récupération et affichage des données d'insertion professionnelle

      displaySimilarFormations( formation.mentionId ); // Affichage des formations similaires
    } );

  const tabs = document.querySelectorAll( ".graphviz-tab" );
  tabs.forEach( ( tab ) => {
    tab.addEventListener( "click", swapTab );
  } );

  document.querySelector( ".retour-resultat-btn" ).addEventListener( "click", () => {
    window.history.back();
  } );
}

/**
 * Permet d'afficher les détails d'une formation
 * @param {*} formation 
 */
function displayFormation ( formation ) {
  /* ----- Récupération des élements et des informations ----- */
  const parcoursFormation = document.getElementById( "parcoursFormation" );
  const alternanceFormation = document.getElementById( "alternanceFormation" ).querySelector( "span" );
  const secDiscNom = document.getElementById( "secDiscFormation" );
  const favButtonFormation = document.querySelector( ".informations-favorite-btn" );
  const location = document.getElementById( "localisationFormation" );

  const allMentions = get( "mentions" );
  const mentionFormation = allMentions.find( ( mention ) => mention.id === formation.mentionId );

  const allSecDisc = get( "secDisc" );
  const secDiscFormation = allSecDisc.find( ( secDisc ) => secDisc.id === formation.secDiscId );

  /* ----- Ajout des informations ----- */

  parcoursFormation.textContent = formation.parcours
    ? formation.parcours
    : mentionFormation.nom.split( "/" )[ 0 ];

  formation.alternance ? ( alternanceFormation.textContent = "Alternance" ) : "Continu";

  secDiscNom.textContent = secDiscFormation.nom;

  favButtonFormation.dataset.formationid = formation.ifc;

  location.textContent = formation.lieux.split( "," )[ 0 ];

  document.title = `${ (formation.parcours || mentionFormation.nom).charAt(0).toUpperCase() + (formation.parcours || mentionFormation.nom).slice(1).toLowerCase() } : Découvrez les informations clés et les évolutions possibles`;

  const metaDescription = document.createElement( "meta" );
  metaDescription.name = "description";
  metaDescription.content = `Découvrez les informations essentielles sur le ${ formation.parcours }, y compris des graphiques et des éléments clés pour vous aider à prendre une décision éclairée sur votre avenir académique.`;
  document.head.appendChild( metaDescription );


  initMap( formation.latitude, formation.longitude, formation.lieux );
  initFavorite();
}

/**
 * Permet de changer d'onglet de graphiques
 * @param {*} evt 
 */
function swapTab ( evt ) {
  const activeTab = document.querySelector( ".active-tab" );

  if ( activeTab ) {
    activeTab.classList.remove( "active-tab" );
    activeTab.setAttribute( "aria-selected", "false" );
  }

  evt.currentTarget.classList.add( "active-tab" );
  evt.currentTarget.setAttribute( "aria-selected", "true" );

  const tabs = document.querySelectorAll( ".graphviz-tab" );
  const contents = document.querySelectorAll( ".graphviz-content-tab" );

  tabs.forEach( ( tab, index ) => {
    if ( tab.classList.contains( "active-tab" ) ) {
      contents[ index ].style.display = "flex";
      contents[ index ].setAttribute( "aria-live", "polite" );
    } else {
      contents[ index ].style.display = "none";
    }
  } );
}

/**
 * Récupère les données de provenance et met à jour le graphe.
 * @param {*} formation La formation sélectionnée.
 */
function displayProvenanceChart ( formation ) {
  createVizBarProvenance(); // Initialise le graphe

  requestStats(
    {
      formationIfcs: [ formation.ifc ],
    },
    {
      typeStats: "candidatures",
      candidatureDetails: [ "general", "experience" ],
    }
  ).then( ( stats ) => {
    updateVizBarProvenance( stats.candidatures[ 0 ].experience );
  } );
}

/**
 * Récupère les données de répartition homme/femme et met à jour le graphe.
 * @param {*} formation Formation sélectionnée
 */
function displayPieMWChart ( formation ) {
  createVizPieRatioFH();

  requestStats(
    {
      formationIfcs: [ formation.ifc ],
    },
    {
      typeStats: "candidatures",
      candidatureDetails: [ "general" ]
    }
  ).then( ( stats ) => {
    updateVizPieRatioFH( { nbF: stats.candidatures[ 0 ].general.nbFemmes, nbT: stats.candidatures[ 0 ].general.nb } );
  } );
}

/**
 *
 * @param {*} formation Formation sélectionnée
 */
function displayPieAcceptMWChart ( formation ) {
  createVizPieAcceptMW();

  requestStats(
    {
      formationIfcs: [ formation.ifc ],
    },
    {
      typeStats: "candidatures",
      admissionDetails: [ "general" ]
    }
  ).then( ( stats ) => {
    updateVizPieAcceptMW( {
      nbF: stats.candidatures[ 0 ].general.acceptFemmes,
      nbT: stats.candidatures[ 0 ].general.accept
    } );
  } );
}

/**
 * Ajout d'un recap des statistiques
 * @param {*} formation 
 */
function displayRadarRecapChart ( formation ) {
  const nbPlace = document.getElementById( "nbPlace" );
  const nbRang = document.getElementById( "lastAccepted" );
  const nbApplication = document.getElementById( "nbApplication" );

  requestStats(
    {
      formationIfcs: [ formation.ifc ],
    },
    {
      typeStats: "candidatures",
      candidatureDetails: [ "general" ]
    }
  ).then( ( stats ) => {
    let data = {
      nbPlaces: stats.candidatures[ 0 ].general.capacite,
      nbRang: stats.candidatures[ 0 ].general.rangDernier,
      nbCandidatures: stats.candidatures[ 0 ].general.nb
    };

    nbPlace.textContent = data.nbPlaces;
    nbRang.textContent = data.nbRang;
    nbApplication.textContent = data.nbCandidatures;

  } );
}

/**
 * Récupère les données de provenance et met à jour le graphe.
 * @param {*} formation La formation sélectionnée.
 */
function displayInserPro ( formation ) {
  createVizLinePro(); // Crée le graphique

  requestStats(
    {
      etablissementIds: [ formation.etabUai ],
    },
    {
      typeStats: "insertionsPro",
      insertionProDetails: [ "general", "salaire" ],
    }
  ).then( ( stats ) => {

    // Filtrez et mappez les données pour ne garder que ce qui est nécessaire
    const filteredStats = stats.insertionsPro.map( ( stat ) => ( {
      anneeCollecte: stat.identifiants.anneeCollecte,
      netMedianTempsPlein: stat.salaire.netMedianTempsPlein,
    } ) );


    // Met à jour le graphique avec les données filtrées
    updateVizLinePro( filteredStats );
  } );
}

/**
 * Initialise la map
 * @param {*} latitude
 * @param {*} longitude
 * @param {*} lieux
 * @returns
 */
function initMap ( latitude, longitude, lieux ) {
  if ( !latitude || !longitude ) {
    console.error( "Coordonnées manquantes pour afficher la carte." );
    return;
  }

  const map = new mapboxgl.Map( {
    container: "map",
    style: "mapbox://styles/mapbox/satellite-v9",
    center: [ longitude, latitude ],
    zoom: 15,
  } );

  new mapboxgl.Marker()
    .setLngLat( [ longitude, latitude ] )
    .setPopup( new mapboxgl.Popup().setText( lieux ) )
    .addTo( map );
}

/**
 * Récupère et affiche les formations similaires.
 * @param {number} idmention L'identifiant de la mention.
 */
function displaySimilarFormations ( idmention ) {
  const swiperContainer = document.querySelector( ".swiper-wrapper" );
  swiperContainer.innerHTML = "<div class='loading-container'><span class='loading-spinner'></span></div>";

  const allMentions = get( "mentions" );
  const mentionFormation = allMentions.find( ( mention ) => mention.id === idmention );

  fetch( `https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/formations?mentionId=${ mentionFormation.id }` )
    .then( ( res ) => {
      if ( !res.ok ) {
        throw new Error( `Erreur lors de la récupération des formations similaires (code ${ res.status })` );
      }
      return res.json();
    } )
    .then( ( formations ) => {
      swiperContainer.innerHTML = "";

      // Limiter aux 10 premières formations
      let formationForMention = formations.filter( ( formation ) =>
        formation.mentionId === mentionFormation.id
      );
      
      const limitedFormations = formationForMention.slice( 0, 10 );

      limitedFormations.forEach( ( formation ) => {
        const slide = document.createElement( "div" );
        slide.classList.add( "swiper-slide" );
        slide.innerHTML = `
          <a href="formation.php?ifc=${ formation.ifc }" class="formation-card">
            <h3>${ formation.parcours || mentionFormation.nom }</h3>
            <p>${ formation.lieux.split( "," )[ 0 ] }</p>
            <span class="btn-details">Voir détails</span>
          </a>
        `;
        swiperContainer.appendChild( slide );
      } );

      // Initialisation de Swiper après avoir ajouté les diapositives
      new Swiper( ".swiper", {
        slidesPerView: 1,
        spaceBetween: 10,
        rewind: true,
        freeMode: true,
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        a11y: {
          enabled: true,
          containerMessage: 'Swiper container',
          containerRoleDescriptionMessage: 'Diaporama des formations similaires',
          firstSlideMessage: 'Première carte de formation',
          lastSlideMessage: 'Dernière carte de formation',
          nextSlideMessage: 'Carte suivante',
          prevSlideMessage: 'Carte précédente',
          slideLabelMessage: '{{index}} / {{slidesLength}}',
          itemRoleDescriptionMessage: 'Slide',
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          640: { slidesPerView: 1, spaceBetween: 0 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 30 },
        },
      } );
    } );
}