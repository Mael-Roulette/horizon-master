"use strict";

import { has, get, set } from "storage";
import { loadFormations } from "network";

document.addEventListener( 'DOMContentLoaded', initFavorite )

/**
 * Permet d'initialiser les favoris
 */
function initFavorite () {
  const favoriteButtons = document.querySelectorAll( ".card-favorite-btn" );
  const favButtonFormation = document.querySelector( ".informations-favorite-btn" );

  if ( has( "cookiesAccepted" ) ) {
    let cookieConsent = get( "cookiesAccepted" );
    if ( cookieConsent === false || cookieConsent === "Not accepted" ) {
      if ( favoriteButtons ) {
        favoriteButtons.forEach( button => {
          // Ajoutez l'événement 'click' pour warn l'utilisateur
          button.addEventListener( 'click', warningFavorite );
        } );
      }

      if ( favButtonFormation ) {
        favButtonFormation.addEventListener( 'click', warningFavorite );
      }
    } else if ( cookieConsent === "Accepted" ) {
      // Vérifiez si des favoris existent
      let favorites = [];
      if ( has( "favoris" ) ) {
        favorites = get( "favoris" );
      }

      favoriteButtons.forEach( button => {
        const cardId = button.dataset.cardid;

        // Si la carte est déjà en favori, ajoutez la classe 'activ'
        if ( favorites.includes( cardId ) ) {
          const svgFavorite = button.querySelector( 'svg' ).querySelector( 'path' );
          svgFavorite.classList.add( "activ" );
        }

        // Permet d'appeler la fonction pour ajouter un favoris
        button.addEventListener( 'click', addFavorite );
      } );

      if ( favButtonFormation ) {
        const formationId = favButtonFormation.dataset.formationid;
        if ( favorites.includes( formationId ) ) {
          const svgFavorite = favButtonFormation.querySelector( 'svg' ).querySelector( 'path' );
          svgFavorite.classList.add( "activ" );
          favButtonFormation.addEventListener( 'click', removeFavorite );
        } else {
          favButtonFormation.addEventListener( 'click', addFavorite );
        }
      }

      // Met à jour l'affichage des favoris au chargement initial
      updateFavoriteContainer( favorites );
    }
  }
}

/**
 * Permet d'ajouter un favori
 * @param {*} evt 
 */
function addFavorite ( evt ) {
  evt.stopPropagation(); // Empêche la propagation de l'événement au lien parent
  const svgFavorite = this.querySelector( 'svg' ).querySelector( 'path' );
  svgFavorite.classList.toggle( "activ" );

  const cardId = this.dataset.cardid || this.dataset.formationid; // Récupère l'ifc placé en data sur le bouton
  let favorites = [];

  if ( has( "favoris" ) ) { // Si les favoris existent
    favorites = get( "favoris" ); // On récupère les favoris

    if ( favorites.includes( cardId ) ) {
      favorites = favorites.filter( id => id !== cardId ); // Si ifc est déjà inclu on retire le favori
    } else {
      favorites.push( cardId ); // Sinon on ajoute l'ifc dans le tableau des favoris
    }
  } else {
    favorites = [ cardId ]; // Si les favoris n'existent pas on les set dans un tableau
  }

  set( "favoris", favorites ); // Enfin, on set les favoris pour les actualiser
  updateFavoriteContainer( favorites ); // Met à jour l'affichage des favoris
}

/**
 * Permet de récupérer certains détails d'une formation
 * @param {*} ifc id d'une formation
 * @returns retourne la formation correspondante à l'id
 */
function getFormationDetails ( ifc ) {
  return loadFormations().then( ( formations ) => {
    const favoriteFormation = formations.find( ( formation ) => formation.ifc === ifc );
    return favoriteFormation;
  } );
}

/**
 * Ajout des favoris dans le conteneur des favoris
 * @param {*} favorites favori à ajouter
 */
function updateFavoriteContainer ( favorites ) {
  const favoriteContainer = document.querySelector( '.favorite-container' );

  // Si le conteneur est vide, on crée tout depuis zéro
  if ( !favoriteContainer.querySelector( '.popup-favori-list' ) ) {
    favoriteContainer.innerHTML = ''; // Vide le conteneur des favoris

    const favoriteList = document.createElement( "ul" );
    favoriteList.classList.add( 'popup-favori-list' );
    favoriteContainer.appendChild( favoriteList );

    favorites.forEach( ifc => {
      getFormationDetails( ifc ).then( formation => {
        if ( formation ) {
          if ( has( 'mentions' ) ) {
            const mentions = get( 'mentions' );
            const mention = mentions.find( mention => mention.id === formation.mentionId );
            const favoriteItem = document.createElement( "li" );
            favoriteItem.classList.add( 'popup-favori-list-item' );
            favoriteList.appendChild( favoriteItem );

            const favoriLink = document.createElement( "a" );
            favoriLink.href = `./formation.php?ifc=${ formation.ifc }`;
            favoriLink.classList.add( 'popup-favori-list-item-link' );
            favoriteItem.appendChild( favoriLink );

            const favoriteItemInfo = document.createElement( 'div' );
            favoriteItemInfo.classList.add( 'popup-favori-list-item-info' );
            favoriLink.appendChild( favoriteItemInfo );

            const lieux = document.createElement( 'p' );
            lieux.classList.add( 'popup-favori-list-item-place' );
            lieux.textContent = formation.lieux.split( ',' )[ 0 ].split( '-' )[ 0 ].trim();
            const parcours = document.createElement( 'p' );
            parcours.classList.add( 'popup-favori-list-item-parcours' );
            parcours.textContent = formation.parcours || mention.nom;
            const favoriteButton = document.createElement( 'button' );
            favoriteButton.classList.add( "card-favorite-btn" );
            favoriteButton.id = formation.ifc;
            favoriteButton.innerHTML = `<svg viewBox="-5 -5 470 630" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 595.647V56.25C2.5 26.5643 26.5643 2.5 56.25 2.5H393.75C423.436 2.5 447.5 26.5643 447.5 56.25V595.647L226.26 466.591L225 465.856L223.74 466.591L2.5 595.647Z" fill="#ffc107" stroke="white" stroke-width="10" /></svg>`;
            favoriteButton.addEventListener( "click", removeFavorite );

            favoriteItemInfo.appendChild( lieux );
            favoriteItemInfo.appendChild( parcours );
            favoriteItem.appendChild( favoriteButton );
          }
        }
      } );
    } );
  } else {
    // Si le conteneur existe déjà, on gère l'ajout ou la suppression de l'élément spécifique
    const favoriteList = favoriteContainer.querySelector( '.popup-favori-list' );
    const existingItems = Array.from( favoriteList.querySelectorAll( '.popup-favori-list-item' ) );

    favorites.forEach( ifc => {
      if ( !existingItems.find( item => item.id === ifc ) ) {
        // Si l'élément n'existe pas déjà, on le crée
        getFormationDetails( ifc ).then( formation => {
          if ( formation ) {
            if ( has( 'mentions' ) ) {
              const mentions = get( 'mentions' );
              const mention = mentions.find( mention => mention.id === formation.mentionId );

              const favoriteItem = document.createElement( "li" );
              favoriteItem.classList.add( 'popup-favori-list-item' );
              favoriteItem.id = formation.ifc;
              favoriteList.appendChild( favoriteItem );

              const favoriLink = document.createElement( "a" );
              favoriLink.href = `./formation.php?ifc=${ formation.ifc }`;
              favoriLink.classList.add( 'popup-favori-list-item-link' );
              favoriteItem.appendChild( favoriLink );

              const favoriteItemInfo = document.createElement( 'div' );
              favoriteItemInfo.classList.add( 'popup-favori-list-item-info' );
              favoriLink.appendChild( favoriteItemInfo );

              const lieux = document.createElement( 'p' );
              lieux.classList.add( 'popup-favori-list-item-place' );
              lieux.textContent = formation.lieux.split( ',' )[ 0 ].split( '-' )[ 0 ].trim();
              const parcours = document.createElement( 'p' );
              parcours.classList.add( 'popup-favori-list-item-parcours' );
              parcours.textContent = formation.parcours || mention.nom;
              const favoriteButton = document.createElement( 'button' );
              favoriteButton.classList.add( "card-favorite-btn" );
              favoriteButton.id = formation.ifc;
              favoriteButton.innerHTML = `<svg viewBox="-5 -5 470 630" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 595.647V56.25C2.5 26.5643 26.5643 2.5 56.25 2.5H393.75C423.436 2.5 447.5 26.5643 447.5 56.25V595.647L226.26 466.591L225 465.856L223.74 466.591L2.5 595.647Z" fill="#ffc107" stroke="white" stroke-width="10" /></svg>`;
              favoriteButton.addEventListener( "click", removeFavorite );

              favoriteItemInfo.appendChild( lieux );
              favoriteItemInfo.appendChild( parcours );
              favoriteItem.appendChild( favoriteButton );
            }
          }
        } );
      }
    } );

    // Vérification et suppression des éléments qui ne sont plus dans la liste des favoris
    existingItems.forEach( item => {
      const itemId = item.id;
      if ( !favorites.includes( itemId ) ) {
        item.remove();
      }
    } );
  }
}


/**
 * Permet de retirer un favori
 * @param {*} evt 
 */
function removeFavorite ( evt ) {
  const cardId = this.id;
  const favButtonFormation = this.dataset.formationid;
  let favorites = get( "favoris" );

  if ( cardId ) {
    favorites = favorites.filter( id => id !== cardId );
  } else if ( favButtonFormation ) {
    favorites = favorites.filter( id => id !== favButtonFormation );
  }
  set( "favoris", favorites );

  updateFavoriteContainer( favorites );
}

/**
 * Avertit l'utilisateur que les favoris sont désactivés
 */
function warningFavorite () {
  alert( "Les favoris sont désactivés car vous n'avez pas accepté les cookies." );
}

export { initFavorite };