async function carregarElementos(janela){
    const sessao = await verificarSessao();

    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    let headerMsg = '';

    headerMsg += `
        <div class="logo">
        <img src='./sources/imgs/logo.png' alt='Logo'/>
      </div>
      <div class="container" id="container-header">
        <!--Parte do INÍCIO-->
        <a id="index" class="a-resto" href="./index.html">Início</a>
          <!--Parte SOBRE MIM-->
        <a id="sobre" class="a-resto" href="./sobre.html">Sobre Mim</a>
          <!--Parte de LOGIN ou da CONTA-->` 

    if(sessao){
        headerMsg += `<a id="criarQuiz" href="./criarQuiz.html" class="a-resto">Criar Seu Quiz</a>
       <a id="conta" href="./conta.html" class="animation-header">Conta</a>`
    } else {
        headerMsg += `<a id="login" class="animation-header" href="./login.html">Login</a>`
    }
    header.innerHTML = headerMsg;

    footer.innerHTML = `&copy; 2026 Geequiz - Todos os Direitos Reservados <br> Dados para contato: <br> WhatsApp: 11 - 9191-0808 <br> Email: suporte@geequiz.com`

    marcarPaginaAtual(janela)
}

function marcarPaginaAtual(janela){
    if(janela === 'index'){
        document.getElementById('index').classList.add('atual')
    } else if(janela === 'sobre'){
        document.getElementById('sobre').classList.add('atual')
    } else if(janela === 'login'){
        document.getElementById('login').classList.add('atual')
    } else if(janela === 'conta'){
        document.getElementById('conta').classList.add('atual')
    } else if(janela === 'criarQuiz'){
        document.getElementById('criarQuiz').classList.add('atual')
    }
}