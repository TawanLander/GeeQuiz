let tentativasGlobal;
let perguntasGlobal;
let opcoesGlobal;

async function carregarQuizAnalisado(id) {
    sessionStorage.setItem('pergunta', 0)
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
        if (!tentativas[linha.tentativa - 1]) tentativas[linha.tentativa - 1] = []; // ? Se ainda não existir tentativa criada ele cria uma nessa posição do array
        tentativas[linha.tentativa - 1].push(linha)
    });

    opcoesGlobal = opcoes;
    perguntasGlobal = perguntas;
    tentativasGlobal = tentativas;

    analisarTentativas();
}

function analisarTentativas() {
    let div = document.getElementById('quiz');
    if (tentativasGlobal.length > 1) {
        let msg = '';
        div.innerHTML = `
        <div class="tentativas">
        <h1>Identificamos mais de uma tentativa nesse quiz!</h1>
        <select id="slct-opcao" onchange="tentativaSelecionada()">
        <option selected disabled hidden>Selecione a tentativa!</option>
        </select></div>
        `
        
        for (let i = 1; i <= tentativasGlobal.length; ++i) {
            document.getElementById('slct-opcao').innerHTML += `<option>${i}</option>`
        }
    } else {
        plotarQuiz(perguntasGlobal, opcoesGlobal, tentativasGlobal[0])
    }
}

function tentativaSelecionada() {
    let selecionada = Number(document.getElementById('slct-opcao').value)
    if (isNaN(selecionada)) return;

    let filtro = tentativasGlobal[selecionada - 1];

    document.querySelector('.tentativas').remove();
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
            let respostaAtual = tentativa.find(resp => resp.opcao === opcaoAtual.id);
            
            if (respostaAtual.tipo === 1) {
                if (respostaAtual.selecionado === 1) {
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
                if (respostaAtual.selecionado === 1) {
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

function passarPergunta(){
    let perguntaAtual = Number(sessionStorage.getItem('pergunta'));
    sessionStorage.setItem('pergunta', perguntaAtual+1);

    let divAtual = document.getElementById(perguntaAtual);
    let divProxima = document.getElementById(perguntaAtual + 1);

    divAtual.classList.add('sumir');
    divProxima.classList.remove('sumir');
}

function voltarPergunta(){
    let perguntaAtual = Number(sessionStorage.getItem('pergunta'));
    sessionStorage.setItem('pergunta', perguntaAtual-1);

    let divAtual = document.getElementById(perguntaAtual);
    let divPassada = document.getElementById(perguntaAtual - 1);

    divAtual.classList.add('sumir');
    divPassada.classList.remove('sumir');
}