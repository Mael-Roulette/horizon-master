let ratioFH = null;

function createVizPieRatioFH() {
    if (!ratioFH) {
        const chartDom = document.getElementById('pieChartHF');
        ratioFH = echarts.init(chartDom);
    } else {
        ratioFH.clear();
    }

    let option = {
        baseOption: {
            title: {
                text: 'Répartition des candidatures selon le sexe',
                textAlign: "center",
                left: '50%',
                textStyle: {
                    fontSize: 16,
                    overflow: "break",
                }
            },
            color: ["#de69dc", "#6274e3"],
            legend: {
                bottom: '5%',
                left: 'center'
            },
            series: [
                {
                    name: 'Répartition des candidatures selon le sexe',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{d}%'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 25,
                            fontWeight: 'bold',
                            formatter: function (params) {
                                return params.value + '%';
                            }
                        }
                    },
                    labelLine: {
                        show: false
                    }
                }
            ]
        },
        media: [
            // Lorsque la largeur est supérieure ou égale à 1200px
            {
                query: {
                    minWidth: 1200
                },
                option: {
                    legend: {
                        bottom: '5%',
                        left: 'center'
                    },
                    series: [
                        {
                            radius: ['40%', '70%'],
                            center: ['50%', '50%']
                        }
                    ]
                }
            },
            // Lorsque la largeur est inférieure à 1200px mais supérieure ou égale à 800px
            {
                query: {
                    minWidth: 800,
                    maxWidth: 1199
                },
                option: {
                    legend: {
                        bottom: '5%',
                        left: 'center',
                    },
                    series: [
                        {
                            radius: ['45%', '70%'],
                            center: ['50%', '50%']
                        }
                    ]
                }
            },
            // Lorsque la largeur est inférieure à 800px
            {
                query: {
                    maxWidth: 799
                },
                option: {
                    legend: {
                        bottom: '5%',
                        left: 'center',
                        orient: 'horizontal' // Changer l'orientation de la légende en horizontal pour les moyens et grands écrans
                    },
                    series: [
                        {
                            radius: ['50%', '70%'],
                            center: ['50%', '50%']
                        }
                    ]
                }
            },
            // Default settings
            {
                option: {
                    legend: {
                        bottom: '5%',
                        left: 'center',
                        orient: 'vertical' // Changer l'orientation de la légende en verticale pour les petits écrans
                    },
                    series: [
                        {
                            radius: ['40%', '70%'],
                            center: ['50%', '50%']
                        }
                    ]
                }
            }
        ]
    };

    ratioFH.setOption(option);
    ratioFH.showLoading();
}

function updateVizPieRatioFH({ nbF, nbT }) {
    let ratioF = Math.floor(nbF * 100 / nbT);
    let option = {
        series: [
            {
                data: [
                    { value: ratioF, name: 'Femme' },
                    { value: (100 - ratioF), name: 'Homme' }
                ]
            }
        ]
    };
    ratioFH.setOption(option);
    ratioFH.hideLoading();
}

export { createVizPieRatioFH, updateVizPieRatioFH };
