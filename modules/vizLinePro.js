let linePro = null;

function createVizLinePro () {
  if ( !linePro ) {
    const chartDom = document.getElementById( 'lineChart' );
    linePro = echarts.init( chartDom );
  } else {
    linePro.clear();
  }

  // Configuration initiale du graphique
  let option = {
    title: {
      show: true,
      text: 'Évolution des salaires net médian',
      textAlign: 'center',
      left: '50%',
    },
    tooltip: {
      trigger: 'axis', // Affiche des infos pour chaque point sur l'axe X
      axisPointer: {
        type: 'line', // Type de pointeur pour interagir avec les données
      },
    },
    legend: {
      data: [ 'Salaire Brut Annuel', 'Salaire Net Médian' ],
      bottom: '10', // Place la légende en bas du graphique
    },
    xAxis: {
      type: 'category',
      boundaryGap: false, // Aligne les points sur l'axe
      data: [], // Données des années (remplies dynamiquement)
      axisLine: {
        lineStyle: {
          color: '#ccc', // Couleur de l'axe
        },
      },
      axisLabel: {
        fontSize: 12,
        color: '#666', // Couleur des labels
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
      axisLabel: {
        fontSize: 12,
        color: '#666',
        rotate: -40,
      },
      splitLine: {
        lineStyle: {
          color: '#ddd',
        },
      },
    },
    series: [
      {
        name: 'Salaire Net Médian',
        type: 'line',
        stack: 'Total',
        data: [], // Données des salaires nets (remplies dynamiquement)
        lineStyle: {
          color: '#1F5C42',
          width: 1,
        },
        itemStyle: {
          color: '#1F5C42',
        },
      },
    ],
    media: [
      // Large écran (largeur > 1200px)
      {
        query: {
          minWidth: 1200
        },
        option: {
          legend: {
            bottom: '15',
            left: 'center'
          },
        }
      },
      // Taille d'écran moyenne (800px < largeur < 1200px)
      {
        query: {
          minWidth: 800,
          maxWidth: 1199
        },
        option: {
          legend: {
            bottom: '10',
            left: 'center'
          },
        }
      },
      // Petit écran (largeur < 800px)
      {
        query: {
          minWidth: 200,
          maxWidth: 799
        },
        option: {
          title: {
            text: 'Évolution des salaires \n net médian',
          },
          legend: {
            bottom: '0',
            left: 'center',
            orient: 'vertical'
          },
          series: [
            {
              lineStyle: { width: 1 },
            },
            {
              lineStyle: { width: 1 },
            },
          ],
        }
      }
    ]
  };

  // Applique la configuration au graphique
  linePro.setOption( option );
  linePro.showLoading(); // Affiche un chargement initial
}

function updateVizLinePro ( stats ) {
  // Regrouper les données par année et calculer les moyennes
  const aggregatedStats = aggregateDataByYear( stats );

  // Extraire les années et les données de salaires à partir des stats agrégées
  const years = aggregatedStats.map( ( stat ) => stat.anneeCollecte );
  const netMedian = aggregatedStats.map( ( stat ) => stat.netMedianTempsPlein );

  // Mettre à jour l'option du graphique
  let option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: years, // Années regroupées
    },
    series: [
      {
        name: 'Salaire Net Médian',
        type: 'line',
        data: netMedian, // Salaires nets agrégés
      },
    ],
  };

  // Met à jour le graphique avec les nouvelles données
  linePro.setOption( option );
  linePro.hideLoading();
}

/**
 * Grouper les données pour avoir des moyennes
 * @param {*} stats 
 * @returns un objet avec les valeurs groupées
 */
function aggregateDataByYear ( stats ) {
  const groupedData = stats.reduce( ( acc, stat ) => {
    const year = stat.anneeCollecte;
    if ( !acc[ year ] ) {
      acc[ year ] = {
        anneeCollecte: year,
        totalBrut: 0,
        totalNet: 0,
        count: 0,
      };
    }
    acc[ year ].totalNet += stat.netMedianTempsPlein;
    acc[ year ].count += 1;
    return acc;
  }, {} );

  // Convertir les données agrégées en tableau et calculer les moyennes
  return Object.values( groupedData ).map( ( group ) => ( {
    anneeCollecte: group.anneeCollecte,
    netMedianTempsPlein: (group.totalNet / group.count).toFixed(2),
  } ) );
}

export { createVizLinePro, updateVizLinePro };