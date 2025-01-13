"use strict";

import { has, set, get, remove } from "storage";
import { loadAcademies, loadEtablissement } from "network";
import { createCard, updateTitleWithResultsCount } from "displayResult";

document.addEventListener( "DOMContentLoaded", initFilter );

function initFilter ( evt ) {
  let globalButton = document.querySelector( ".result-content-filter-i" );
  if ( globalButton ) {
    globalButton.addEventListener( "click", ouvertureOuFermetureFiltres );
  }

  let items = document.querySelectorAll( ".filter-list-item" );
  items.forEach( ( item ) => {
    let itemButton = item.querySelector( ".filter-list-item-group" );
    if ( itemButton ) {
      itemButton.addEventListener( "click", ouvertureOuFermetureItem );
    }
  } );

  checkFilters();

  document.querySelector( ".filter-button" ).addEventListener( "click", addFilterInLink );
}

function checkFilters () {
  let urlFilters = new URLSearchParams( window.location.search );

  let searchMention = document.getElementById( "searchMentionInput" );
  if ( urlFilters.has( "mention" ) ) {
    searchMention.value = urlFilters.get( "mention" );
  }

  if ( urlFilters.has( "idMention" ) ) {
    const allMentions = get( "mentions" );
    const mapMention = allMentions.find(
      ( mention ) => mention.id === Number( urlFilters.get( "idMention" ) )
    );
    searchMention.value = mapMention.nom;
  }

  let tauxAdmission = document.getElementById( "slider" );
  if ( urlFilters.has( "nbPlaces" ) ) {
    tauxAdmission.value = Math.min(
      Math.max( +urlFilters.get( "nbPlaces" ), tauxAdmission.min ),
      tauxAdmission.max
    );
  } else {
    tauxAdmission.value = tauxAdmission.max;
  }

  let region = document.getElementById( "region" );
  if ( urlFilters.has( "regionName" ) ) {
    let choices = Array.from( region.children );
    let find = false;
    choices.forEach( ( choice ) => {
      if ( choice.value === urlFilters.get( "regionName" ) ) {
        choice.selected = true;
        find = true;
      }
    } );

    if ( !find ) {
      choices[ 0 ].selected = true;
    }
  }
}

function addFilterInLink ( evt ) {
  let filters = {};

  let searchBar = document.getElementById( "searchInput" );
  if ( searchBar.value !== "" ) {
    filters.recherche = searchBar.value;
  }

  let searchMention = document.getElementById( "searchMentionInput" );
  if ( searchMention.value !== "" ) {
    filters.discipline = searchMention.value;
  }

  let region = document.getElementById( "region" );
  filters.region = region.value;

  console.log( filters );
  applyFilters( filters );
}

function applyFilters ( filters ) {
  const resultWrapper = document.querySelector( '.result-wrapper' );
  resultWrapper.innerHTML = "";
  resultWrapper.innerHTML = "<div class='loading-container'><span class='loading-spinner'></span></div>";

  if ( !has( "rechercheFormations" ) ) {
    console.error( "Aucune formation trouvée dans le stockage." );
    return;
  }

  const actualSearch = get( "rechercheFormations" );
  if ( !filters.discipline && !filters.region && !filters.recherche ) {
    console.warn( "Aucun filtre appliqué." );
    return;
  }

  let url = "https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/formations?q=";

  const disciplineQuery = filters.discipline ? filters.discipline.toLowerCase() : "";
  if ( disciplineQuery ) {
    url += `${ encodeURIComponent( disciplineQuery ) }&`;
  }

  const searchParams = filters.recherche || "";
  if ( searchParams ) {
    const searchWords = searchParams.split( /\s+/ ).filter( Boolean );
    searchWords.forEach( ( word ) => {
      url += `${ encodeURIComponent( word ) }&`;
    } );
  }

  url = url.endsWith( "&" ) ? url.slice( 0, -1 ) : url;
  console.log( "URL de recherche :", url );

  fetch( url )
    .then( ( res ) => {
      if ( !res.ok ) {
        throw new Error( `Erreur lors du chargement des formations (code ${ res.status })` );
      }

      if ( has( "rechercheFormations" ) ) {
        remove( "rechercheFormations" );
      }

      return res.json();
    } )
    .then( ( formations ) => {
      set( "rechercheFormations", formations );

      const regionQuery = filters.region;
      if ( regionQuery !== "" || regionQuery !== null ) {
        loadAcademies().then( ( academies ) => {
          const academiesInRegion = academies.filter( ( academy ) =>
            academy.regionNom.includes( regionQuery )
          );

          const academiesIds = academiesInRegion.map( ( academy ) => academy.id );

          loadEtablissement().then( ( etablissements ) => {
            const etabInAcademies = etablissements.filter( ( etab ) =>
              academiesIds.includes( etab.academieId )
            );

            const etabUai = etabInAcademies.map( ( etab ) => etab.uai );

            const formationInEtab = formations.filter( ( formation ) =>
              etabUai.includes( formation.etabUai )
            );

            resultWrapper.innerHTML = "";

            const cardsList = document.createElement( "ul" );
            resultWrapper.appendChild( cardsList )

            // On ajoute les cards avec les datas des formations
            formationInEtab.forEach( data => {
              const card = createCard( data );
              cardsList.appendChild( card );
            } );

            updateTitleWithResultsCount( formationInEtab.length );
          } );
        } );
      } else {
        resultWrapper.innerHTML = "";

        const cardsList = document.createElement( "ul" );
        resultWrapper.appendChild( cardsList )

        // On ajoute les cards avec les datas des formations
        formations.forEach( data => {
          const card = createCard( data );
          cardsList.appendChild( card );
        } );

        updateTitleWithResultsCount( formations.length );
      }
    } )
    .catch( ( error ) => {
      console.error( "Erreur lors du chargement des données :", error );
    } );
}

function ouvertureOuFermetureFiltres ( evt ) {
  let liste = document.querySelector( ".filter-list" );

  if ( liste.classList.contains( "open" ) ) {
    liste.classList.remove( "open" );
    liste.setAttribute( "aria-expanded", "false" );
  } else {
    liste.classList.add( "open" );
    liste.setAttribute( "aria-expanded", "true" );
  }
}

function ouvertureOuFermetureItem ( evt ) {
  let item = evt.currentTarget.closest( ".filter-list-item" );
  if ( !item ) return;

  let contenu = item.querySelector( ".contenu" );
  if ( !contenu ) return;

  if ( item.classList.contains( "open" ) ) {
    item.classList.remove( "open" );
    item.setAttribute( "aria-expanded", "false" );

    let fleche = item.querySelector( ".filter-list-i" );
    if ( fleche ) {
      fleche.classList.remove( "fa-chevron-up" );
      fleche.classList.add( "fa-chevron-down" );
    }
  } else {
    item.classList.add( "open" );
    item.setAttribute( "aria-expanded", "true" );

    let fleche = item.querySelector( ".filter-list-i" );
    if ( fleche ) {
      fleche.classList.remove( "fa-chevron-down" );
      fleche.classList.add( "fa-chevron-up" );
    }
  }
}
