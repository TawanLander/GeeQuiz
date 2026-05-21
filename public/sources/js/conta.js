
let senhaUsuario = '';
const token = sessionStorage.getItem("token");

async function plotarDadosUsuario() {

  const dados = await fetch("/usuarios/dados", {
    // ? PEGA OS DADOS DO BACKEND DO USUÁRIO LOGADO
    headers: {
      token: token,
    },
  });

  if (!dados.ok) return console.log("Erro no fetch dos dados!");

  const informacao = await dados.json(); // ? SE O FETCH DER CERTO, PEGA OS VALORES, TRANSFORMA EM JSON E APLICA NA PÁGINA

  senhaUsuario = informacao.senha; // ? ARMAZENA A SENHA NUMA VARIÁVEL GLOBAL | NÃO HÁ IMPORTÂNCIA DE MOSTRAR A SENHA, JÁ QUE ELA É DO PRÓPRIO USUÁRIO

  document.getElementById("bd-nome").innerHTML = informacao.nome;
  document.getElementById("bd-genero").innerHTML = informacao.identidade;
  document.getElementById("bd-quizes").innerHTML = informacao.quizes;
  document.getElementById("bd-senha").innerHTML = '************';
  document.getElementById("bd-email").innerHTML = informacao.email;
  document.getElementById("bd-idade").innerHTML = informacao.idade;
}

const btn = document.getElementById('btn-senha'); // ? PEGA OS ATRIBUTOS PARA MOSTRAR OU OCULTAR A SENHA DO USUÁRIO
const path = btn.querySelector('path');

let ocultado = true; // ? BOOLEANA PARA SABER SE ESTÁ OCULTADO OU NÃO A SENHA

function esconderSenha(){
    if (ocultado) {
    // ? LÓGICA IGUAL PARA AMBOS OS CASOS, ALTERAR O PATH DO SVG (OLHO ABERTO || FECHADO)
    path.setAttribute('d', 'M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z');

    // ? ALTERA O INNERHTML DO CAMPO SENHA
    document.getElementById('bd-senha').innerHTML = senhaUsuario;
    // ? INVERTE A BOOLEANA
    ocultado = false;
  } else {

    path.setAttribute('d', 'm644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z');

    document.getElementById('bd-senha').innerHTML = '************';
    ocultado = true;
  }
}

async function deslogarUsuario() {
  const deslogar = await fetch('/usuarios/deslogar', {
    headers: {
      'token': sessionStorage.getItem('token')
    }
  });

  if (!deslogar.ok) throw new Error(`Erro ao deslogar!`);

  sessionStorage.clear();

  setTimeout(() => {
    window.location.href = './index.html'
  }, 1000);
}

async function excluirConta() {
  const excluir = await fetch('/usuarios/excluir', {
    headers: {
      'token': sessionStorage.getItem('token')
    }
  });

  if (!excluir.ok) throw new Error(`Erro ao excluir!`);


  sessionStorage.clear();

  setTimeout(() => {
    window.location.href = './index.html'
  }, 1000);
}

async function plotarGraficos() {
  const cargo = await verificarSessao('cargo');

  if (cargo != 'a') return;

  const div = document.getElementById('main');
  div.innerHTML += `
    <div class="parte">
      <div class="info">
          <h1 style="text-align: center;">Métricas</h1>
          <div class="dashs">
              <canvas id="chart-generos"></canvas>
          </div>
          <div class="dashs">
              <canvas id="chart-idade"></canvas>
          </div>
          <div class="dashs">
              <canvas id="chart-mediaQuizes"></canvas>
          </div>
          <!--<div class="dashs">
              <canvas id="chart-perguntasPorQuiz"></canvas>
          </div>-->
      </div>
  </div>
  `
  exibirDados();
}

async function pegarQuizesCompletos() {
  const div = document.getElementById('main');

  const pegarQuizes = await fetch('/quizes/completos', {
    headers: {
      token: sessionStorage.getItem('token')
    }
  });
  
  if (!pegarQuizes.ok) throw new Error(`Erro no fetch! ${pegarQuizes.status}`);

  const quizes = await pegarQuizes.json();

  if (quizes.length === 0) return;

  let msg = '<div class="parte"><h1>Seu histórico de quizes!</h1><div class="quizes">';

  quizes.forEach(item => {
    msg += `
    <div class="quiz" onclick="redirecionarParaAnalise(${item.id})">
      <div><img src="${item.imagem}"></div>
      <div class="geral"><h1>${item.titulo}</h1>
      <div class="content">Gênero: ${item.genero}</div>
      <div class="content">Tipo: ${item.tipo}</div>
      <div class="content">Quantidade de Perguntas: ${item.qtd}</div>
      <div class="content">Gostados: 4</div>
      <div class="content">Feito por: ${item.nome}</div>
    </div></div>
      `
  });

  msg += '</div></div>'

  div.innerHTML += msg;
}

function redirecionarParaAnalise(id) {
  sessionStorage.setItem('quiz', id);

  window.location.href = './analiseQuiz.html'
}

async function mudarValores(){
  let div = document.querySelector('.info');

  const elemento = await fetch('/mudarValores.html');

  if(!elemento.ok) return false;

  const res = await elemento.text();

  div.innerHTML = res;
}