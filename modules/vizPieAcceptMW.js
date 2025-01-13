let ratioMW = null;

function createVizPieAcceptMW() {
    if (!ratioMW) {
        const chartDom = document.getElementById('acceptMWPieChart');
        ratioMW = echarts.init(chartDom);
    } else {
        ratioMW.clear();
    }

    let option = {
        baseOption: {
            title: {
                text: 'Répartition des admissions selon le sexe',
                left: 'center',
                top: 'top',
            },
            color: ["#de69dc", "#6274e3"],
            legend: {
                bottom: '5%',
                left: 'center'
            },
            series: [
                {
                    name: 'Répartition des admissions selon le sexe',
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

    ratioMW.setOption(option);
    ratioMW.showLoading();
}

function updateVizPieAcceptMW({ nbF, nbT }) {
    let ratioW = Math.floor(nbF * 100 / nbT);
    let option = {
        series: [
            {
                data: [
                    { value: ratioW, name: 'Femme' },
                    { value: (100 - ratioW), name: 'Homme' }
                ]
            }
        ]
    };
    ratioMW.setOption(option);
    ratioMW.hideLoading();
}

export { createVizPieAcceptMW, updateVizPieAcceptMW };
