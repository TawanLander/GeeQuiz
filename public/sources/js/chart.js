// TODO SÓ SERÁ COMENTADO A PRIMERIA FUNÇÃO POIS TODAS AS OUTRAS SÃO IGUAIS

function plotarDadosGeneros(array){ // ! DEFINE A FUNÇÃO DE PLOTAR OS DADOS NO GRÁFICO
    const labels = ['Masculino', 'Feminino', 'Prefiro Não Dizer', 'Outros']; // ! ARRAY COM AS LABELS (COLUNAS DO GRÁFICO)

    const valores = [0, 0, 0, 0]; // ! DEFINE OS VALORES (OS NÚMEROS DE CADA COLUNA)

    array.forEach(item => { // ? O BANCO RETORNA DOIS VALORES: O NOME DA PRÓPRIA LABEL E O TOTAL (NÚMERO), DESSA FORMA É POSSÍVEL VERIFICAR O ÍNDICE DA LABEL, SE ESSE ÍNDICE NÃO FOR NEGATIVO (OU SEJA O SELECT RETORNOU ALGO) SIGNIFICA QUE TEM VALORES, E PORTANTO SOBRESCREVE O 0 POR ESSE NOVO VALOR;
        const index = labels.indexOf(item.identidade);

        if(index != -1) valores[index] = item.total
    });
    
    var chartQuizes = new Chart(document.getElementById('chart-generos').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                borderColor: ['navy', 'lightpink', 'gray', 'black'],
                backgroundColor: ['navy', 'lightpink', 'gray', 'black'],
                data: valores
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Distribuição de Gênero',
                    align: 'center',
                    position: 'top',
                    font: {size: 24, weight: 'bold'},
                    padding: {top: 40, bottom: 10},
                    color: '#1c1c1c'
                }
            }
        }
    
    });
}

function plotarDadosIdade(array){
    const labels = ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-79', '80+'];

    const valores = [0, 0, 0, 0, 0, 0, 0, 0];

    array.forEach(item => {
        const index = labels.indexOf(item.faixa_etaria);

        if(index != -1) valores[index] = item.total
    });

    var chartIdades = new Chart(document.getElementById('chart-idade').getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: ['lightblue', '#1c1c1c'],
                data: valores
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Faixa Etária',
                    align: 'center',
                    position: 'top',
                    font: {size: 24, weight: 'bold'},
                    padding: {top: 40, bottom: 10},
                    color: '#1c1c1c'
                }
            }
        }
    });
}



function plotarDadosMedia(array){
    const labels = ['1-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100', '100+'];

    const valores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    array.forEach(item => {
        const index = labels.indexOf(item.total_quizes);

        if(index != -1) valores[index] = item.total
    });

    var chartMediaQuizes = new Chart(document.getElementById('chart-mediaQuizes').getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: ['rgb(0, 0, 71)', 'rgb(0, 72, 94)'],
                data: valores
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Tentativas Feitas por Usuário',
                    align: 'center',
                    position: 'top',
                    font: {size: 24, weight: 'bold'},
                    padding: {top: 40, bottom: 10},
                    color: '#1c1c1c'
                }
            }
        }
    });
}

function exibirDados(){
    fetch('/usuarios/informacoes', { // ? FETCH PARA FAZER TUDO FUNCIONAR, MANDA UM TOKEN (PORQUE ESSE DADOS SÓ PODEM SER VISTOS POR UM ADMINISTRADOR DO SISTEMA)
        headers: {
            'token': sessionStorage.getItem('token')
        }
    }).then(async response => {
        if(response.ok){ // ? A RESPOSTA RETORNA UM ARRAY COM OS RESULTADOS E SÓ DIVIDIMOS ELE PARA CADA GRÁFICO
            const resultado = await response.json();
    
            plotarDadosGeneros(resultado[0]);
            plotarDadosIdade(resultado[1]);
            plotarDadosMedia(resultado[2]);
    
        } else {
            response.text().then(msg => {
                console.error(msg)
            })
        }
    });
}