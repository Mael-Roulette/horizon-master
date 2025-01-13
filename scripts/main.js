import { loadSectDisciplinaires, loadMentions } from "network";
import { initCookieBanner } from './cookie.js';
import { has, set } from "storage";

"use strict";

loadSectDisciplinaires().then( ( secDisc ) => {
    set( "secDisc", secDisc );
} )

loadMentions().then( ( mentions ) => {
    set( "mentions", mentions );
} )


// Gestion du bandeau des cookies
initCookieBanner();

if ( has( 'cookiesAccepted' ) ) {
    console.log( "Le cookie 'cookiesAccepted' existe." );
} else {
    console.log( "Le cookie 'cookiesAccepted' n'existe pas." );
}

/* -------------------------------------------------- */
/* ---------- Gestion du menu ---------- */
document.addEventListener( "DOMContentLoaded", initMenu );

/**
 * Fonciton qui initialise le menu
 * @param {*} evt
 */
function initMenu ( evt ) {
    let bouton = document.querySelector( ".header-content-menu-i" );
    bouton.addEventListener( "click", toggleMenu );
    bouton.addEventListener( "keydown", handleKeyboardEvents );

    let liens = document.querySelectorAll( ".header-content-nav-list-links" );
    for ( let lien of liens ) {
        if ( window.location.href == lien.href ) {
            lien.classList.add( "header-content-nav-list-link-current" );
            lien.ariaCurrent = "page";
        }
    }

    const header = document.querySelector( "header" );
    const main = document.querySelector( "main" );

    function adjustMainHeight () {
        let headerHeight = header.offsetHeight;
        main.style.minHeight = `calc(100vh - ${ headerHeight }px)`;
    }

    const aside = document.querySelector( "aside" );

    function adjustAsideHeight () {
        let headerHeight = header.offsetHeight;
        if ( window.innerWidth > 768 ) {
            aside.style.minHeight = `calc(100vh - ${ headerHeight }px)`;
        }
    }

    adjustMainHeight();

    if ( aside ) {
        adjustAsideHeight();
    }

    window.addEventListener( "resize", adjustMainHeight );

    const headerFavoriBtn = document.getElementById( "popup-favori" );
    const closeFavori = document.getElementById( "close-favori" );
    const overlay = document.getElementById( "overlay" );

    headerFavoriBtn.addEventListener( "click", toggleFavoriModal );
    closeFavori.addEventListener( "click", toggleFavoriModal );
    overlay.addEventListener( "click", toggleFavoriModal );

    // Ajout de l'écouteur pour la touche Échap pour fermer le menu
    document.addEventListener( "keydown", closeMenuOnEsc );
}

/**
 * Fonction pour ouvrir le menu
 * @param {*} evt
 */
function openMenu ( evt ) {
    let iconeBouton = document.querySelector( ".header-content-menu-i" );
    let liste = document.querySelector( ".header-content-nav-list" );

    // Vérifier si l'élément existe
    if ( !liste ) return;

    // Ouvrir le menu
    liste.classList.add( "header-content-nav-list-ouvert" );
    iconeBouton.classList.remove( "fa-bars" );
    iconeBouton.classList.add( "fa-times" );
    liste.ariaExpanded = "true";
}

/**
 * Fonction pour fermer le menu
 * @param {*} evt
 */
function closeMenu ( evt ) {
    let iconeBouton = document.querySelector( ".header-content-menu-i" );
    let liste = document.querySelector( ".header-content-nav-list" );

    // Vérifier si l'élément existe
    if ( !liste ) return;

    // Fermer le menu
    liste.classList.remove( "header-content-nav-list-ouvert" );
    iconeBouton.classList.remove( "fa-times" );
    iconeBouton.classList.add( "fa-bars" );
    liste.ariaExpanded = "false";
}

/**
 * Fonction d'ouverture et de fermeture du menu
 * @param {*} evt
 */
function toggleMenu ( evt ) {
    let liste = document.querySelector( ".header-content-nav-list" );

    // Vérifier si l'élément existe
    if ( !liste ) return;

    if ( liste.classList.contains( "header-content-nav-list-ouvert" ) ) {
        closeMenu( evt ); // Ferme le menu
    } else {
        openMenu( evt ); // Ouvre le menu
    }
}

/**
 * Fonction qui gère l'ouverture et la fermeture du menu avec les touches du clavier
 * @param {*} evt
 */
function handleKeyboardEvents ( evt ) {
    if ( evt.key === "Enter" ) {
        toggleMenu( evt ); // Ouvre ou ferme le menu si la touche Enter est pressée
    }
}

/**
 * Fonction qui permet de fermer le menu lorsqu'on appuie sur Échap
 * @param {*} evt
 */
function closeMenuOnEsc ( evt ) {
    if ( evt.key === "Escape" ) {
        let liste = document.querySelector( ".header-content-nav-list" );
        if ( liste.classList.contains( "header-content-nav-list-ouvert" ) ) {
            closeMenu( evt ); // Ferme le menu si il est ouvert
        }
    }
}


/**
 * Fonction qui permet d'ouvrir ou fermer le popup favori
 */
function toggleFavoriModal () {
    const popupFavori = document.getElementById( "favori" );
    const overlay = document.getElementById( "overlay" );

    popupFavori.classList.toggle( "open" );
    overlay.classList.toggle( "visible" );
    document.body.classList.toggle( "no-scroll" );

    // Ajout d'attribut ARIA pour la gestion de la popup
    const isOpen = popupFavori.classList.contains( "open" );
    popupFavori.setAttribute( "aria-hidden", !isOpen );
    overlay.setAttribute( "aria-hidden", !isOpen );
}
