function obterDados() {
    fetch('/quizes').then(response => {
        if (response.ok) {
            response.json().then(r => {
                r.reverse();
                plotarDados(r)
            })
        } else {
            console.error('Erro na coleta de dados PLOTAR.JS')
        }
    })
}

async function plotarDados(r) {
    const sessao = await verificarSessao();
    const cargo = await verificarSessao('cargo');

    const divQuizes = document.getElementById('div-quizes');
    r.forEach(item => {

    let msg = '';

    if(sessao){
        msg += `<div id="${item.idQuiz}" class="quiz" onclick="salvarDados(${item.idQuiz})">`
    } else {
        msg += `<div class="quiz" onclick="window.location='./login.html'">`
    }

    msg += `
    <div><img src="${item.imagem}"></div>
    <div class="geral"><h1>${item.titulo}</h1>
    <div class="content">Gênero: ${item.genero}</div>
    <div class="content">Tipo: ${item.tipo}</div>
    <div class="content">Quantidade de Perguntas: ${item.qtd}</div>
    <div class="content">Gostados: 4</div>
    `

    if(item.fkUsuario != null){
        msg += `<div class="content">Feito por: ${item.nome}</div></div>`
    } else {
     msg += `<div class="content">Feito por: GeeQuiz</div></div>`   
    }
    if(cargo === 'a'){
        msg += `<div class="deletar" onclick="removerQuiz(${item.idQuiz})"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#571302"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></div></div>`
    }

    divQuizes.innerHTML += msg;
    });
}

function removerQuiz(id){
    event.stopPropagation();
    
    let div = document.getElementById(id);
    let imagem = div.querySelector('img');
    let titulo = div.querySelector('h1');
    let infos = div.querySelectorAll('.content');

    sessionStorage.setItem('quizModel', JSON.stringify({
        id: id,
        titulo: titulo.textContent,
        imagem: imagem.src,
        genero: infos[0].textContent,
        tipo: infos[1].textContent,
        qtdPerguntas: infos[2].textContent,
        gostados: infos[3].textContent,
        feitoPor: infos[4].textContent
    }))

    window.location.href = './remover.html'
}