let barProvenance = null;

function createVizBarProvenance() {
  if (!barProvenance) {
    const chartDom = document.getElementById('barProvenance');
    barProvenance = echarts.init(chartDom);
  } else {
    barProvenance.clear();
  }

  let option = {
    baseOption: {
      title: {
        show: true,
        text: "Comparaison du nombre de candidats et d'admis en 2023",
        textAlign: "center",
        left: "50%"
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: [],
      },
      yAxis: {
        type: 'value',
        name: 'Nombre',
        nameLocation: 'middle',
        nameGap: 50
      },
      legend: {
        data: ["Candidature", "Admission"],
        bottom: '15'
      },
      series: [
        {
          name: "Candidature",
          type: 'bar',
          data: [],
          barWidth: '40%',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}'
          },
          itemStyle: {
            color: '#1F5C42',
            borderColor: '#1F5C42',
            borderWidth: 0
          }
        },
        {
          name: "Admission",
          type: 'bar',
          data: [],
          barWidth: '40%',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}'
          },
          itemStyle: {
            color: '#6274e3',
            borderColor: '#6274e3',
            borderWidth: 0
          }
        }
      ]
    },
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
          series: [
            {
              barWidth: '40%'
            },
            {
              barWidth: '40%'
            }
          ]
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
          series: [
            {
              barWidth: '35%'
            },
            {
              barWidth: '35%'
            }
          ]
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
            text: "Comparaison du nombre de candidats \n et d'admis en 2023",
          },
          legend: {
            bottom: '0',
            left: 'center',
            orient: 'vertical'
          },
          series: [
            {
              barWidth: '25%'
            },
            {
              barWidth: '25%'
            }
          ]
        }
      }
    ]
  };

  barProvenance.setOption(option);
  barProvenance.showLoading();
}

function updateVizBarProvenance(experience) {
  let types = Object.keys(experience);
  let option = {
    xAxis: {
      type: 'category',
      data: types
    },
    series: [
      {
        name: "Candidature",
        type: 'bar',
        data: types.map((value) => {
          return experience[value]["nb"];
        })
      },
      {
        name: "Admission",
        type: 'bar',
        data: types.map((value) => {
          return experience[value]["accept"];
        })
      }
    ]
  };
  barProvenance.setOption(option);
  barProvenance.hideLoading();
}

export { createVizBarProvenance, updateVizBarProvenance };
