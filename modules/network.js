const BASE_API_URL = 'https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest';

/**
 * Charge les académies depuis l'API
 * @returns {Promise<any>}
 */
function loadAcademies () {
  return fetch( `${ BASE_API_URL }/academies` )
    .then( ( res ) => {
      if ( !res.ok ) {
        throw new Error( `Erreur lors du chargement des académies (code ${ res.status })` );
      }
      return res.json();
    } ).then( ( academies ) => {
      return academies;
    } )
}

/**
 * Charge les établissements depuis l'API
 * @returns {Promise<any>}
 */
function loadEtablissement () {
  return fetch( `${ BASE_API_URL }/etablissements` )
    .then( ( res ) => {
      if ( !res.ok ) {
        throw new Error( `Erreur lors du chargement des établissements (code ${ res.status })` );
      }
      return res.json();
    } ).then( ( etablissements ) => {
      return etablissements;
    } )
}

/**
 * Charge les formations depuis l'API
 * @returns {Promise<any>}
 */
function loadFormations () {
  return fetch( `${ BASE_API_URL }/formations` )
    .then( ( res ) => {
      if ( !res.ok ) {
        throw new Error( `Erreur lors du chargement des formations (code ${ res.status })` );
      }
      return res.json();
    } )
    .then( ( formations ) => {
      return formations;
    } )
}

/**
 * Charge les mentions depuis l'API
 * @returns {Promise<any>}
 */
function loadMentions () {
  return fetch( `${ BASE_API_URL }/mentions` )
    .then( ( res ) => {
      if ( !res.ok ) {
        throw new Error( `Erreur lors du chargement des mentions (code ${ res.status })` )
      }
      return res.json();
    } )
    .then( ( mentions ) => {
      return mentions;
    } )
}

function loadSectDisciplinaires () {
  return fetch( `${ BASE_API_URL }/secteurs-disciplinaires` )
    .then( ( res ) => {
      if ( !res.ok ) {
        throw new Error( `Erreur lors du chargement des secteurs disciplinaires (code ${ res.status })` )
      }
      return res.json();
    } )
    .then( ( secDisc ) => {
      return secDisc;
    } )
}

function requestStats ( filtres = null, collecte = null ) {
  // Création de la requête
  const requete = {};
  if ( filtres ) {
    requete.filters = filtres;
  }
  if ( collecte ) {
    requete.harvest = collecte;
  }
  // Exécution de la recherche de statistiques
  return fetch( `${ BASE_API_URL }/stats/search`, {
    method: 'POST',
    headers: new Headers( { 'content-type': 'application/json' } ),
    body: JSON.stringify( requete, null, 0 )
  } ).then( ( reponse ) => {
    if ( !reponse.ok ) {
      throw new Error( `Erreur serveur lors du chargement des statistiques (code ${ reponse.status }.`, requete );
    }
    return reponse.json();
  } );
}

export { loadAcademies, loadEtablissement, loadFormations, loadMentions, loadSectDisciplinaires, requestStats };