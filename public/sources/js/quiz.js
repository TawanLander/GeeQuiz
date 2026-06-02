const divQuiz = document.getElementById("quiz");

function salvarDados(id) {
  // ! FUNÇÃO UTILIZADA PARA SALVAR OS DADOS DO QUIZ, QUANDO CLICA NELE NO INDEX.HTML
  sessionStorage.setItem(`quiz`, id); // ? SALVA O ID DO QUIZ NO SESSION STORAGE
  window.location = "./quiz.html"; // ? REDIRECIONA O USUÁRIO PARA A PÁGINA DO QUIZ.HTML
}

function pegarDados() {
  let quiz = sessionStorage.getItem("quiz"); // ! PEGA O ID DO QUIZ, PARA PLOTAR AS PERGUNTAS E OPÇÕES REFERENTE A ELE

  fetch("/quizes/perguntas", {
    // ? PEGA OS DADOS DAS PERGUNTAS DO BANCO
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    body: JSON.stringify({
      fkQuiz: quiz,
    }),
  }).then((response) => {
    if (response.ok) {
      response.json().then((perguntas) => {
        fetch("/quizes/opcoes", {
          // ? SE TIVER TUDO OK COM AS PERGUNTAS, PEGA AS OPÇÕES
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            fkQuiz: quiz,
          }),
        }).then((response) => {
          if (response.ok) {
            response.json().then((opcoes) => {
              plotarPerguntas(perguntas, opcoes); // ? SE TUDO DER OK PLOTA TUDO NA PÁGINA
            });
          }
        });
      });
    } else {
      console.error("Erro no fetch QUIZ.JS");
    }
  });
}

function plotarPerguntas(perguntas, opcoes) {
  sessionStorage.setItem("pergunta", 0);

  for (let i = 0; i < perguntas.length; ++i) {
    // ? PEGA A OPÇÃO RESPECTIVA DE CADA PERGUNTA POR MEIO DE UM FILTER
    let filter = opcoes.filter(
      (opcao) => opcao.fkPerguntas === perguntas[i].id,
    );

    let msg = "";

    if (i === 0) {
      msg += `<div id="${i}" ><div class="pergunta">`;
    } else {
      msg += `<div id="${i}" class="sumir"><div class="pergunta">`;
    }

    msg += `
          <h3>${perguntas[i].titulo}</h3>
          <div><img src="${perguntas[i].imagem}"></div></div>
        <div class="opcoes">`;

    let tipoDoInput = "radio"; // ! SE SÓ HOUVER UMA OPÇÃO CORRETA O TIPO DE INPUT SERÁ RÁDIO, SE NÃO, SERÁ CHECKBOX
    if (perguntas[i].tipo != "n") {
      tipoDoInput = "checkbox";
    }
    // ? OUTRO FOR, USADO PARA PLOTAR AS OPÇÕES DE CADA PERGUNTA
    for (let e = 0; e < filter.length; ++e) {
      let opcao = filter[e]; // ! PARA AGILIZAR, PEGA AS OPÇÕES JÁ FILTRADAS;

      // ? RADIO BUTTON - SÓ PODE TER UMA OPÇÃO ESCOLHIDA DE CADA VEZ! O NOME É O LET "I", RADIOS COM MESMO NOME NÃO PODEM SER SELECIONADOS AO MESMO TEMPO.

      msg += `
        <label class="opcao"> 
        <input type="${tipoDoInput}" name="${i}" value="${opcao.tipo}">
        <span class="check"></span>
        ${opcao.titulo}
        </label>`;
    }

    msg += `</div><div class="guias">`; // ? COMEÇA AS CLASSES DOS BOTÕES GUIAS

    if (i != 0) {
      // ? VERIFICA SE NÃO É A PRIMEIRA PERGUNTA, SE NÃO FOR, TERÁ A OPÇÃO VOLTAR
      msg += `<button onclick="voltarPergunta()" class="voltar">Voltar Pergunta</button>`;
    }
    // ? VERIFICA SE NÃO É A ÚLTIMA PERGUNTA POR MEIO DO LENGTH -1; SE FOR COLOCA O BOTÃO TERMINAR QUIZ
    if (i != perguntas.length - 1) {
      msg += `<button onclick="passarPergunta()" class="passar">Próxima Pergunta</button>`;
    } else {
      msg += `<button onclick="terminarQuiz()" class="passar">Terminar Quiz</button>`;
    }

    msg += `</div><div class="erro sumir">Selecione ao menos uma opção!</div></div>`; // ? ADICIONA A PARTE DE ERRO, CASO O USUÁRIO NÃO SELECIONE NENHUMA OPÇÃO

    divQuiz.innerHTML += msg; // ? PASSA A LIMPO A MENSAGEM NA DIV
  }
}

function passarPergunta(atual) {
  const pergunta = sessionStorage.getItem("pergunta"); // ! PEGA A PERGUNTA ATUAL (FICA ARMAZENADA NO SESSION STORAGE)
  const erro = document.querySelectorAll(".erro"); // ! PEGA TODOS OS ELEMENTOS DA CLASSE .ERRO (FICA ABAIXO DO BOTÃO, CASO O USUÁRIO NÃO SELECIONE NADA)

  if (document.querySelectorAll(`[name="${pergunta}"]:checked`).length <= 0) {
    // ? IF PARA VER SE O USUÁRIO SELECIONOU ALGUMA COISA, AS PERGUNTAS SÃO PLOTADAS COM O NOME DELAS SENDO O NÚMERO DA PERGUNTA
    erro[pergunta].classList.remove("sumir");
    erro[pergunta].classList.add("aparecer");
    return false; // * RETORNA FALSE INPORTANTE NA FUNÇÃO terminarQuiz();
  }

  contarPontuacao(); // ? FAZ A FUNÇÃO CONTAR PONTUAÇÃO

  // ? CONFIRMAÇÃO SE NÃO PASSAR PELO IF, SIGNIFICA QUE SELECIONOU, CONFIRMA QUE VAI SUMIR O ERRO PARA CASO O USUÁRIO VOLTAR
  erro[pergunta].classList.remove("aparecer");
  erro[pergunta].classList.add("sumir");

  const div = document.getElementById(Number(pergunta)); // ! PEGA A PERGUNTA ATUAL AS DIVS TEM O ID DELAS REPRESENTANDO O NÚMERO DA PERGUNTA
  const proxima = document.getElementById(Number(pergunta) + 1); // ! PEGA A PRÓXIMA PERGUNTA

  // ? COLOCA DISPLAY NONE NA PERGUNTA ATUAL
  div.classList.add("sumir");
  div.classList.remove("aparecer");

  // ? VERIFICA SE TEM PRÓXIMA PERGUNTA, SE TIVER, FAZ ELA APARECER
  proxima?.classList.add("aparecer");
  proxima?.classList.remove("sumir");

  // ? PASSA A PERGUNTA, SALVANDO O NÚMERO DA PRÓXIMA NO SESSION STORAGE
  sessionStorage.setItem("pergunta", Number(pergunta) + 1);
  return true; // * RETORNA TRUE INPORTANTE NA FUNÇÃO terminarQuiz();
}

function voltarPergunta(atual) {
  const pergunta = sessionStorage.getItem("pergunta"); // ! PEGA O NÚMERO DA PERGUNTA ATUAL
  const div = document.getElementById(Number(pergunta)); // ! PEGA A PERGUNTA ATUAL AS DIVS TEM O ID DELAS REPRESENTANDO O NÚMERO DA PERGUNTA
  const anterior = document.getElementById(Number(pergunta) - 1); // ! PEGA A PERGUNTA ANTERIOR

  // ? COLOCA DISPLAY NONE DA PERGUNTA ATUAL
  div.classList.add("sumir");
  div.classList.remove("aparecer");

  // ? FAZ A PERGUNTA ANTERIOR APARECER
  anterior.classList.add("aparecer");
  anterior.classList.remove("sumir");

  pontuacao.pop();
  // ? CONFIRMA O SESSION STORAGE PARA A PERGUNTA ANTERIOR
  sessionStorage.setItem("pergunta", Number(pergunta) - 1);
}

const pontuacao = []; // ! ARRAY PARA CONTAR A PONTUAÇÃO DAS PERGUNTAS

function contarPontuacao() {
  let pergunta = JSON.parse(sessionStorage.getItem("pergunta"));

  let opcaoSelecionado = document.querySelectorAll(
    `[name="${pergunta}"]:checked`,
  );
  let paraAcertar;
  let acertos = 0;

  for (let i = 0; i < opcaoSelecionado.length; ++i) {
    if (opcaoSelecionado[i].value === "1") {
      acertos++;
    } else {
      acertos--;
    }
  }

  if (acertos < 0) acertos = 0;

  let pctg = 0;

  let opcoes = document.querySelectorAll(`[name="${pergunta}"]`);

  opcoes.forEach((i) => {
    pctg += Number(i.value);
  });

  let pontuacaoFinal = acertos / pctg;

  pontuacao.push({ pontuacao: pontuacaoFinal, acertos: [] });

  opcoes.forEach((i) => {
    let acerto = false;
    if (i.checked) {
      acerto = true;
    }
    pontuacao[pontuacao.length - 1].acertos.push({
      selecionado: acerto,
      valor: i.value,
    });
  });
}

function terminarQuiz() {
  const resultado = passarPergunta();
  if (!resultado) return; // ? VERIFICA SE A PERGUNTA PODE SER PASSADA (CASO NÃO TENHA SELECIONADO NADA VOLTA FALSE)

  document.getElementById("quiz").classList.add("sumir"); // ? FAZENDO A ÚLTIMA PERGUNTA SUMIR AO CLICAR EM TERMINAR

  const final = document.querySelector(".terminar"); // ! PEGA A DIV TERMINAR, JÁ NATURALMENTE NO HTML, MAS COM DISPLAY NONE
  const elemento = document.getElementById("pontuacao"); // ! PEGA O ELEMENTO QUE MOSTRARÁ A PONTUAÇÃO DO USUÁRIO AO FINAL DO QUIZ
  const maxima = document.getElementById("maxima"); // ! PARA MOSTRAR A PONTUAÇÃO MÁXIMA

  let pontos = 0; // ! PARA VER O TOTAL DE PONTOS DO USUÁRIO

  for (let i = 0; i < pontuacao.length; ++i) {
    // ? SOMA TODOS OS PONTOS DO USUÁRIO
    pontos += Number(pontuacao[i].pontuacao);
  }

  elemento.innerHTML = pontos; // ? PASSA A LIMPO OS PONTOS DO USUÁRIO
  maxima.innerHTML = Number(sessionStorage.getItem("pergunta")); // ? PASSA A LIMPO A QUANTIDADE MÁXIMA DE PONTOS (A PRÓPRIA QUANTIDADE DE PERGUNTAS)

  // ? FAZ A DIV DE FINALIZAÇÃO APARECER NA TELA
  final.classList.remove("sumir");
  final.classList.add("aparecer");



  fetch("/quizes/terminar", {
    // ? ENVIA OS DADOS DO USUÁRIO, QUE FINALIZOU O QUIZ PARA O BANCO DE DADOS
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'token': sessionStorage.getItem("token")
    },
    body: JSON.stringify({
      fkQuiz: sessionStorage.getItem('quiz'),
      array: pontuacao // ? PASSA O ARRAY INTEIRO DA PONTUAÇÃO REGISTRADA DURANTE O QUIZ E SALVA ISSO NO BANCO DE DADOS 
    }),
  }).then(async r => {
    const m = await r.text();

    if (!r.ok) {
      throw new Error(m);
    }

  }).catch((e) => {

    console.error(e);

  });
}

function verDetalhes() {
  window.location.href = './analiseQuiz.html'
}

const coracao = document.getElementById('coracao');
const coracaoPath = document.getElementById('coracao-path');
let gostado = false;

coracao?.addEventListener('mouseenter', () => {
  coracaoPath.setAttribute('d', 'm480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z');
  coracao.style.transform = 'scale(1.05)'
})

coracao?.addEventListener('mouseleave', () => {
  coracao.style.transform = 'scale(1)'
  if (gostado) return;
  coracaoPath.setAttribute('d', 'm480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z');
});

coracao?.addEventListener('click', async () => {
  const gostei = await fetch('/quizes/gostei', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'token': sessionStorage.getItem('token')
    },
    body: JSON.stringify({
      idQuiz: sessionStorage.getItem('quiz')
    })
  });

  if (!gostei.ok) return false;

  verificarGostei()

  document.getElementById('confirmacao-like').classList.replace('sumir', 'aparecer');
});

async function verificarGostei() {
  const verificar = await fetch('/quizes/verificarGostei', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'token': sessionStorage.getItem('token')
    },
    body: JSON.stringify({
      idQuiz: sessionStorage.getItem('quiz')
    })
  });

  if (!verificar.ok) return false;

  const result = await verificar.text();

  if (result === 'Com like') {
    gostado = true;
    coracaoPath.setAttribute('d', 'm480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z');
  } else {
    gostado = false;
    coracaoPath.setAttribute('d', 'm480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z');

  }
}