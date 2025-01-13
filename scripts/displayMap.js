import { loadEtablissement, loadAcademies, loadFormations, loadMentions } from "../modules/network.js";
import { get, set, remove, has } from "../modules/storage.js";

const chartDom = document.getElementById( 'displayMap' );
const myChart = echarts.init( chartDom );

let selectedRegion = null; // Variable pour stocker la région sélectionnée

function createFullOption () {
  return {
    geo: {
      map: 'France',
      roam: false, // N'autorise pas le déplacement et le zoom dans la carte avec de la souris
      itemStyle: {
        areaColor: '#7F7F7F' // Couleur de base des zones
      },
      nameProperty: 'nom',
      emphasis: { // Styles appliqués au survol
        itemStyle: {
          areaColor: '#32956b',
        },
        label: {
          show: false
        }
      },
      regions: selectedRegion ? [ { name: selectedRegion, itemStyle: { areaColor: '#1F5C42' } } ] : []
    },
    tooltip: {
      formatter: ( { data } ) => data.name
    },
  };
}

// Affiche le logo de chargement de la carte
myChart.showLoading();
// Récupère les données json des régions de france avec fetch
fetch( '../franceRegions.json' )
  .then( ( response ) => {
    if ( !response.ok ) {
      throw new Error( `Erreur de récupération de la carte (${ response.status })` );
    }
    return response.json();
  } ).then( ( carteFrance ) => {
    // Enregistrement de la carte dans le graphique avec en option la modification du placement et de l'échelle de certaines zones
    echarts.registerMap( 'France', carteFrance, {
      Guyane: {
        left: -7.834939110760255,
        top: 48.1885808164957,
        width: 1
      },
      Guadeloupe: {
        left: -7.834939110760255,
        top: 46,
        width: 2
      },
      Martinique: {
        left: -7.834939110760255,
        top: 44,
        width: 1
      },
      Mayotte: {
        left: -7.834939110760255,
        top: 42,
        width: 1
      },
      'La R\u00e9union': {
        left: -7.834939110760255,
        top: 40,
        width: 1
      },
    } );
    myChart.hideLoading();
    myChart.setOption( createFullOption() );
    myChart.on( 'click', function ( params ) {
      if ( params.componentType === 'geo' ) {
        selectedRegion = params.name; // Mettre à jour la région sélectionnée
        myChart.setOption( createFullOption() ); // Mettre à jour les options de la carte
        displayMention( selectedRegion );
      }
    } );


  } ).catch( ( error ) => {
    alert( 'Une erreur est survenue: ' + error.message );
  } );

/**
 * Permet d'afficher les mentions en fonction d'une région
 * @param {*} regionName nom de la région sélectionné
 */
function displayMention ( regionName ) {
  const resultList = document.querySelector( '.map-result-list' );
  resultList.innerHTML = "<div class='loading-container'><span class='loading-spinner'></span></div>";

  loadAcademies().then( ( academies ) => {
    // Filtrer les académies en fonction du nom de la région normalisé
    const academiesInRegion = academies.filter(
      ( academy ) => academy.regionNom.includes( regionName )
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
        const formationInEtab = formations.filter( ( formation ) =>
          etabUai.includes( formation.etabUai )
        );

        const mentionId = formationInEtab.map( ( formation ) => formation.mentionId );

        const mentions = get( 'mentions' );
        const mentionInFormation = mentions.filter( ( mention ) =>
          mentionId.includes( mention.id )
        );

        const resultList = document.querySelector( '.map-result-list' );
        resultList.innerHTML = "";

        // Supprimer l'ancien <h3> s'il existe
        const oldHeading = document.querySelector( '.map-result p' );
        if ( oldHeading ) {
          oldHeading.remove();
        }

        resultList.insertAdjacentHTML( 'beforebegin', `<p>${ regionName }</p>` );

        // Ajouter les mentions filtrés à la liste
        if ( mentionInFormation.length === 0 ) {
          const errorText = document.createElement( "p" );
          resultList.appendChild( errorText );
          errorText.textContent = `Aucune mention trouvé pour la région : ${ regionName }`;
        } else {
          remove( "rechercheFormations" ); // On supprime les formations recherché avec la recherche
          remove( "mentionForRegion" ); // On supprime les mentions d'une région précedemment cliqué
          const list = document.createElement( "ul" ); // Création de la liste de formation

          const linkMore = document.createElement( "a" ); // Ajout d'un lien pour voir toutes les mentions
          linkMore.textContent = "Voir toutes les mentions"; // texte du lien voir plus
          linkMore.href = `results.php?regionName=${ regionName }`
          linkMore.classList.add( 'map-result-content-more' ); // Ajout class au lien voir plus
          linkMore.addEventListener( 'click', () => {
            set( 'mentionForRegion', [ mentionInFormation, etabInAcademies ] );
          } );

          // Ajout dans le DOM
          resultList.appendChild( list );
          resultList.appendChild( linkMore );

          mentionInFormation.forEach( ( mention ) => {
            const listItem = document.createElement( 'li' );
            listItem.classList.add( 'map-result-list-item' );
            const itemLink = document.createElement( 'a' );
            itemLink.textContent = mention.nom.charAt( 0 ).toUpperCase() + mention.nom.slice( 1 ).toLowerCase();
            itemLink.href = `./results.php?idMention=${ mention.id }&regionName=${ regionName }`;
            itemLink.addEventListener( 'click', ( evt ) => {
              set( 'rechercheFormations', formations );
              saveSearch( regionName, mention.id, mention.nom );
            } );
            listItem.appendChild( itemLink );
            list.appendChild( listItem );
          } );
        }
      } );
    } );
  } );
}

/**
 * Sauvegarde une recherche dans le localStorage
 * @param {string} regionName - Nom de la région recherchée
 * @param {string} mentionName - Nom de la mention associée (facultatif)
 */
function saveSearch ( regionName, mentionId, mentionName = null ) {
  const newSearch = { region: regionName, mentionId: mentionId, mentionName: mentionName, date: new Date().toISOString() };

  let recentSearches = [];

  if ( has( "recentSearches" ) ) {
    recentSearches = get( "recentSearches" );
    // Assurez que recentSearches est bien un tableau
    if ( !Array.isArray( recentSearches ) ) {
      recentSearches = [];
    }
  }

  recentSearches.unshift( newSearch );
  recentSearches = recentSearches.slice( 0, 5 ); // Maximum 5 recherches

  set( "recentSearches", recentSearches );
}

/**
 * Affiche les recherches récentes avec région, mention et date formatée
 */
document.addEventListener( 'DOMContentLoaded', () => {
  const recentSearches = has( "recentSearches" ) ? get( "recentSearches" ) : [];
  const recentSearchesList = document.querySelector( ".map-recent-searches-list" );

  // Vider la liste avant d'ajouter les éléments
  recentSearchesList.innerHTML = "";

  if ( recentSearches.length === 0 ) {
    const noSearchItem = document.createElement( "li" );
    noSearchItem.textContent = "Aucune recherche récente";
    recentSearchesList.appendChild( noSearchItem );
    return;
  }

  recentSearches.forEach( ( search ) => {
    const listItem = document.createElement( "li" );
    const link = document.createElement( "a" );

    // Format de la date JJ/MM/AAAA
    const formattedDate = new Date( search.date ).toLocaleDateString( "fr-FR" );

    link.textContent = `${ search.mentionName } - ${ search.region } (${ formattedDate })`;
    link.href = `./results.php?idMention=${ search.mentionId }&regionName=${ search.region }`;
    link.addEventListener( 'click', ( evt ) => {
      set( 'rechercheFormations', formations );
    } );

    listItem.appendChild( link );
    recentSearchesList.appendChild( listItem );
  } );
} );