let recap = null;

function createWebChartRecap() {
    if (!recap) {
        const chartDom = document.getElementById('webChartRecap');
        recap = echarts.init(chartDom);
    } else {
        recap.clear();
    }
    let option = {
        title: {
            text: 'Récapitulatif'
        },
        radar: {
            // shape: 'circle',
            indicator: [
                {name: 'Nombre de places', max: 50, color: "#000000"}, // Max de places d'une université à récupérer de l'API
                {name: 'Dernier rang', max: 50, color: "#000000"}, // Max à récupérer de l'API
                {name: 'Nombre de candidatures', max: 150, color: "#000000"}, // Max à récupérer de l'API
            ],
            center: ['40%', '70%']
        },
        series: [
            {
                name: 'Récapitulatif',
                type: 'radar'
            }
        ]

  };
  recap.setOption( option );
  recap.showLoading();
}

function updateWebChartRecap ( { nbPlaces, nbRang, nbCandidatures } ) {
  let option = {
    series: [
      {
        data: [
          { value: [ nbPlaces, nbRang, nbCandidatures ] }
        ]
      }
    ]
  };
  recap.setOption( option );
  recap.hideLoading();
}

export { createWebChartRecap, updateWebChartRecap };