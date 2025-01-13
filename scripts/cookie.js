import { set, has, get } from "storage";

const COOKIE_BANNER_SELECTOR = '.cookie-banner';
const ACCEPT_BUTTON_SELECTOR = '.accept-cookie';
const REFUSE_BUTTON_SELECTOR = '.refuse-cookie';

// Clé utilisée pour identifier le consentement dans les cookies
const COOKIE_CONSENT_NAME = 'cookiesAccepted';

/**
 * Cache le bandeau des cookies
 */
function hideCookieBanner () {
  const cookieBanner = document.querySelector( COOKIE_BANNER_SELECTOR );
  if ( cookieBanner ) {
    cookieBanner.style.display = 'none';
  }
}

/**
 * Permet de désactiver les favoris
 */
function disableFavorite () {
  const warningText = document.getElementById( "warningFavori" );

  warningText.textContent = "Vous n'avez pas accepté les cookies, vous ne pouvez pas ajouter vos favoris";

  const existingButton = document.getElementById( 'acceptAfter' );
  if ( !existingButton ) {
    warningText.insertAdjacentHTML( 'afterend', '<button class="button-primary" id="acceptAfter">Accepter les cookies</button>' );
  }
  const acceptAfterBtn = document.getElementById( 'acceptAfter' );

  if ( acceptAfterBtn ) {
    acceptAfterBtn.addEventListener( 'click', () => {
      set( COOKIE_CONSENT_NAME, 'Accepted' );
      console.log( 'Cookies acceptés : Favoris activés.' );
      window.location.reload();
    } );
  }
}

/**
 * Initialise la gestion des cookies.
 * Vérifie si le consentement existe déjà et attache les événements pour les boutons.
 */
export function initCookieBanner () {
  document.addEventListener( 'DOMContentLoaded', () => {
    const cookieBanner = document.querySelector( COOKIE_BANNER_SELECTOR );
    const acceptCookieBtn = document.querySelector( ACCEPT_BUTTON_SELECTOR );
    const refuseCookieBtn = document.querySelector( REFUSE_BUTTON_SELECTOR );

    if ( !cookieBanner || !acceptCookieBtn || !refuseCookieBtn ) {
      console.warn( 'Bandeau ou boutons de cookies introuvables.' );
      return;
    }

    // Vérifier si le consentement est déjà donné
    let getConsent = has( COOKIE_CONSENT_NAME );
    let consent = null;
    if ( getConsent ) {
      consent = get( COOKIE_CONSENT_NAME );
    }

    if ( getConsent === false ) {
      // Afficher le bandeau si aucun consentement n'a été donné
      cookieBanner.style.display = 'flex';

      // Bouton "Accepter"
      acceptCookieBtn.addEventListener( 'click', () => {
        set( COOKIE_CONSENT_NAME, 'Accepted' );
        hideCookieBanner();
        console.log( 'Cookies acceptés : Favoris activés.' );
      } );

      // Bouton "Refuser"
      refuseCookieBtn.addEventListener( 'click', () => {
        set( COOKIE_CONSENT_NAME, 'Not accepted' );
        hideCookieBanner();
        console.log( 'Cookies refusés : Favoris désactivés.' );
        disableFavorite();
      } );
    } else if ( consent === "Not accepted" ) {
      console.log( 'Les cookies ont déjà été refusés.' );
      hideCookieBanner();
      disableFavorite();

    } else if ( consent === "Accepted" ) {
      console.log( 'Les cookies ont déjà été acceptés.' );
      hideCookieBanner();
    }
  } );
}
