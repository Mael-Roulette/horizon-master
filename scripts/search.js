"use strict"
import {set, has, remove, get} from "storage";

document.addEventListener('DOMContentLoaded', initSearch);

/**
 * Permet d'initialiser la recherche
 */
function initSearch() {
    const buttonSearch = document.getElementById('searchButton');

    buttonSearch.addEventListener('click', loadQuery);
}

/**
 * Lance la recherche des formations
 * @param {*} evt
 */
function loadQuery(evt) {
    evt.preventDefault();

    // Retire les mentions recherchées de la carte du local storage
    if (has('mentionForRegion')) {
        remove('mentionForRegion');
    }

    const searchValue = document.getElementById('searchInput').value.trim();
    const keywords = searchValue.split(/\s+/); // Découpe les mots-clés par espace

    // Construire une requête où tous les mots-clés sont vérifiés
    const query = keywords.map(keyword => `q=${encodeURIComponent(keyword)}`).join('&');

    fetch(`https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/formations?${query}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Erreur lors du chargement des formations (code ${res.status})`);
            }

            // Clear les données si déjà présentes
            if (has('rechercheFormations')) {
                remove('rechercheFormations');
            }

            return res.json();
        })
        .then((formations) => {
            // Filtrer les résultats pour ne conserver que ceux correspondant à tous les mots-clés
            const filteredFormations = formations.filter((formation) => {
                return keywords.every((keyword) => {
                    const lowerKeyword = keyword.toLowerCase();
                    return JSON.stringify(formation).toLowerCase().includes(lowerKeyword);
                });
            });

            // Stocker les données dans le stockage de session
            set('rechercheFormations', filteredFormations);
            // Rediriger vers la page de résultats
            window.location.href = `results.php?rechercheFormations=${searchValue}`;
        })
        .catch((error) => {
            console.error(error);
        });
}
