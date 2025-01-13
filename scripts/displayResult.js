import { loadFormations, loadAcademies, loadEtablissement } from "network";
import { has, get } from "storage";
import { initFavorite } from "./addFavorites.js";

document.addEventListener( 'DOMContentLoaded', initResult );

/**
 * Permet d'initialiser la page de résultat
 */
function initResult () {
  const urlParams = new URLSearchParams( window.location.search );
  const uniqueMention = urlParams.get( 'idMention' );

  if ( uniqueMention ) {
    displayUniqueMentionRegion( urlParams, uniqueMention );
  }
  else {
    console.log( "Aucun id provenant de l'url de la page n'a été trouvé." )
  }

  if ( has( 'mentionForRegion' ) ) { // Recherche de la sélection des mentions par région dans le local storage
    displayMentionForRegion();
  }
  else {
    console.log( "Aucune mention provenant de la page map trouvée dans le stockage de session." )
  }

  if ( has( "rechercheFormations" ) ) { // On vérifie que la recherche soit mise en local storage
    displayRechercheFormation();
  }
  else {
    console.log( 'Aucune formation recherchée trouvée dans le stockage de session.' );
  }
}

/**
 * Permet de créer la carte d'une formation
 * @param {*} data 
 * @returns 
 */
function createCard ( data ) {
  // Crée un élément de type lien (card)
  const card = document.createElement( 'li' );
  card.classList.add( 'card' );

  console.log( data );

  if ( has( 'mentions' ) ) {
    const mentions = get( 'mentions' );
    console.log( mentions );
    const mention = mentions.find( mention => mention.id === data.mentionId );
    console.log( mention );
    data.mention = mention.nom;
  }

  // Ajoute le contenu de la carte
  card.innerHTML = `
    <a href="formation.php?ifc=${ data.ifc }" class="card-content">
      <p class="card-content-etab">${ data.lieux }</p>
      <p class="card-content-parcours">${ data.parcours || data.mention }</p>
    </a>
    <button class="card-favorite-btn" data-cardid="${ data.ifc }">
      <svg viewBox="-5 -5 470 630" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 595.647V56.25C2.5 26.5643 26.5643 2.5 56.25 2.5H393.75C423.436 2.5 447.5 26.5643 447.5 56.25V595.647L226.26 466.591L225 465.856L223.74 466.591L2.5 595.647Z" fill="transparent" stroke="white" stroke-width="10" />
      </svg>
    </button>
  `;

  return card;
}

/**
 * Change le titre de la page avec le nombre de résultat
 * @param {*} count nombre de résultats
 */
function updateTitleWithResultsCount ( count ) {
  document.title = `Horizon Master | ${ count } résultats trouvés`;
}

/**
 * Affiche une seule mention pour une région donnée
 * @param {*} urlParams 
 * @param {*} uniqueMention 
 */
function displayUniqueMentionRegion ( urlParams, uniqueMention ) {
  const resultWrapper = document.querySelector( '.result-wrapper' );
  resultWrapper.innerHTML = "<div class='loading-container'><span class='loading-spinner'></span></div>";

  const uniqueMentionRegion = urlParams.get( 'regionName' );
  loadAcademies().then( ( academies ) => {
    // Filtrer les académies en fonction du nom de la région normalisé
    const academiesInRegion = academies.filter(
      ( academy ) => academy.regionNom.includes( uniqueMentionRegion )
    );

    // Récupérer les IDs des académies de la région
    const academiesIds = academiesInRegion.map( ( academy ) => academy.id );

    // Charger les établissements et filtrer ceux qui appartiennent aux académies trouvées
    loadEtablissement().then( ( etablissements ) => {
      const etabInAcademies = etablissements.filter( ( etab ) =>
        academiesIds.includes( etab.academieId )
      );

      const etabUai = etabInAcademies.map( ( etab ) => etab.uai );

      loadFormations().then( ( formations ) => {
        const uniqueMentionNumber = parseInt( uniqueMention, 10 );

        const formationForUniqueMention = formations.filter( ( formation ) =>
          formation.mentionId === uniqueMentionNumber && etabUai.includes( formation.etabUai )
        );

        const cardContainer = document.querySelector( ".result-wrapper" );

        if ( formationForUniqueMention.length > 0 ) {

          cardContainer.innerHTML = ""; // On vide le container des cards
          // Création de l'élément list
          const cardsList = document.createElement( "ul" );
          cardContainer.appendChild( cardsList )

          // On ajoute les cards avec les datas des formations
          formationForUniqueMention.forEach( ( data ) => {
            const card = createCard( data );
            cardsList.appendChild( card );
          } );

          updateTitleWithResultsCount( formationForUniqueMention.length );
        } else {
          console.log( 'Aucune formation trouvée pour cette mention.' );
          updateTitleWithResultsCount( 0 );
        }

        initFavorite();
      } );
    } )
  } )
}

/**
 * Affiche les formations trouvées pour les mentions sélectionnées par région
 */
function displayMentionForRegion () {
  const resultWrapper = document.querySelector( '.result-wrapper' );
  resultWrapper.innerHTML = "<div class='loading-container'><span class='loading-spinner'></span></div>";

  const mentionForRegion = get( 'mentionForRegion' ); // on réucpère les données
  const cardContainer = document.querySelector( ".result-wrapper" );
  if ( mentionForRegion.length > 0 ) {

    const mentionIds = mentionForRegion[ 0 ].map( mention => mention.id ); // On récupère tous les ids des mentions
    const formationEtab = mentionForRegion[ 1 ].map( etab => etab.uai ); // On récupère tous les ids des mentions

    // On récupère toutes les formations qui contiennent les Ids des mentions
    loadFormations().then( ( formations ) => {
      const formationForMention = formations.filter( ( formation ) =>
        mentionIds.includes( formation.mentionId ) && formationEtab.includes( formation.etabUai ),
      );
      cardContainer.innerHTML = ""; // On vide le container des cards
      // Création de l'élément list
      const cardsList = document.createElement( "ul" );
      cardContainer.appendChild( cardsList )

      // On ajoute les cards avec les datas des formations
      const cardsData = formationForMention;
      cardsData.forEach( data => {
        const card = createCard( data );
        cardsList.appendChild( card );
      } );

      initFavorite();
      updateTitleWithResultsCount( formationForMention.length );
    } )
  } else {
    updateTitleWithResultsCount( 0 );
    console.log( 'Aucune mention trouvées' );
  }
}

/**
 * Affiche les formations trouvées dans la recherche
 */
function displayRechercheFormation () {
  const resultWrapper = document.querySelector( '.result-wrapper' );
  resultWrapper.innerHTML = "<div class='loading-container'><span class='loading-spinner'></span></div>";

  const rechercheFormations = get( 'rechercheFormations' ); // On récupère les formations de la recherche
  const cardContainer = document.querySelector( ".result-wrapper" );

  if ( rechercheFormations.length > 0 ) {
    cardContainer.innerHTML = ""; // On vide le container des cards
    // Création de l'élément list
    const cardsList = document.createElement( "ul" );
    cardContainer.appendChild( cardsList )

    // On rendre les données dans une variable
    const cardsData = rechercheFormations;

    // On ajoute les cards avec les datas
    cardsData.forEach( data => {
      const card = createCard( data );
      cardsList.appendChild( card );
    } );

    updateTitleWithResultsCount( rechercheFormations.length );
  } else {
    updateTitleWithResultsCount( 0 );

    console.log( 'Aucune formation trouvées pour cette recherche' );
  }

  initFavorite();
}

export { displayMentionForRegion, displayUniqueMentionRegion, displayRechercheFormation, createCard, updateTitleWithResultsCount };