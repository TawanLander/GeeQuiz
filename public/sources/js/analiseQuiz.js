let tentativasGlobal;
let perguntasGlobal;
let opcoesGlobal;

async function carregarQuizAnalisado(id) {
    const perguntasFetch = await fetch('/quizes/perguntas', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            fkQuiz: id
        })
    });

    if (!perguntasFetch.ok) window.location.href = './conta.html'

    const opcoesFetch = await fetch('/quizes/opcoes', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            fkQuiz: id
        })
    })

    if (!opcoesFetch.ok) window.location.href = './conta.html'

    const opcoesSelecionadasFetch = await fetch('/quizes/selecionados', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            fkQuiz: id
        })
    });

    if (!opcoesSelecionadasFetch.ok) window.location.href = './conta.html'
    let perguntas = await perguntasFetch.json();
    let opcoes = await opcoesFetch.json();
    let opcoesSelecionadas = await opcoesSelecionadasFetch.json();

    let tentativas = [];

    opcoesSelecionadas.forEach(linha => {
        if (!tentativas[linha.tentativa - 1]) tentativas[linha.tentativa - 1] = [];
        tentativas[linha.tentativa - 1].push(linha)
    });

    let auxiliar = [];
    for (let i = 0; i < tentativas.length; ++i) {
        if (tentativas[i] != undefined) auxiliar.push(tentativas[i]);
    }
    tentativas = auxiliar;

    opcoesGlobal = opcoes;
    perguntasGlobal = perguntas;
    tentativasGlobal = tentativas;

    analisarTentativas(tentativas);
}

function analisarTentativas(tentativas) {
    let div = document.getElementById('quiz');
    if (tentativas.length > 1) {
        let msg = '';
        div.innerHTML = `
        <div class="tentativas">
        <h1>Identificamos mais de uma tentativa nesse quiz!</h1>
        Escolha uma opção:
        <select id="slct-opcao" onchange="tentativaSelecionada()">
        <option selected disabled hidden>Selecione a tentativa!</option>
        </select></div>
        `

        for (let i = 1; i <= tentativas.length; ++i) {
            document.getElementById('slct-opcao').innerHTML += `<option>${i}</option>`
        }
    }

    plotarQuiz(perguntasGlobal, opcoesGlobal, tentativasGlobal)
}

function tentativaSelecionada() {
    let selecionada = Number(document.getElementById('slct-opcao').value)
    if (selecionada === NaN) return
    let filtro = tentativasGlobal.filter(item => {
        console.log(item)
        item.tentativa = selecionada
    });

    plotarQuiz(perguntasGlobal, opcoesGlobal, filtro);
}




function plotarQuiz(perguntas, opcoes, tentativa) {
    for (let i = 0; i < perguntas.length; ++i) {
        let msg = '';

        let perguntaAtual = perguntas[i];
        let filtro = opcoes.filter(op => op.fkPerguntas === perguntaAtual.id);

        if (i === 0) {
            msg += `<div id="${i}" ><div class="pergunta">`;
        } else {
            msg += `<div id="${i}" class="sumir"><div class="pergunta">`;
        }

        msg += `
          <h3>${perguntaAtual.titulo}</h3>
          <div><img src="${perguntaAtual.imagem}"></div></div>
        <div class="opcoes">`;

        for (let e = 0; e < filtro.length; ++e) {
            let opcaoAtual = filtro[e];

            if (tentativa.tipo === 1) {
                if (tentativa.selecionado === 1) {
                    msg += `
                        <label class="opcao correta", style="cursor:default"> 
                        ${opcaoAtual.titulo} ✅ Selecionada
                        </label>
                    `;
                } else {
                    msg += `
                        <label class="opcao correta", style="cursor:default"> 
                        ${opcaoAtual.titulo} ❌ Não Selecionada
                        </label>
                    `;
                }
            } else {
                if (tentativa.selecionado === 1) {
                    msg += `
                        <label class="opcao", style="cursor:default"> 
                        ${opcaoAtual.titulo} ❌ Selecionada
                        </label>
                    `;
                } else {
                    msg += `
                        <label class="opcao", style="cursor:default"> 
                        ${opcaoAtual.titulo} ✅ Não Selecionada
                        </label>
                    `;
                }
            }
        }

        msg += `</div><div class="guias">`

        if (i != 0) {
            // ? VERIFICA SE NÃO É A PRIMEIRA PERGUNTA, SE NÃO FOR, TERÁ A OPÇÃO VOLTAR
            msg += `<button onclick="voltarPergunta()" class="voltar">Voltar Pergunta</button>`;
        }
        // ? VERIFICA SE NÃO É A ÚLTIMA PERGUNTA POR MEIO DO LENGTH -1; SE FOR COLOCA O BOTÃO TERMINAR QUIZ
        if (i != perguntas.length - 1) {
            msg += `<button onclick="passarPergunta()" class="passar">Próxima Pergunta</button>`;
        } else {
            msg += `<button onclick="terminarRevisao()" class="passar">Terminar Revisão</button>`;
        }

        document.getElementById('quiz').innerHTML += msg
    }
}

function terminarRevisao() {
    sessionStorage.removeItem('quiz');
    sessionStorage.removeItem('pergunta');
    window.location.href = './conta.html'
}