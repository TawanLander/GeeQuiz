let generoAlternativo = false;
let nomeFormatado = '';
let passouNoNome = false;
let passouNoEmail = false;
let passouNaSenha = false;
let passouNaData = false;
let passouNoGenero = false;


function verificarNome() {
    const nome = document.getElementById('ipt-nome');
    let nomeValor = nome.value;

    if(nomeValor.length >= 3){
        passouNoNome = true;
    } else {
        passouNoNome = false;
    }

    let separar = nomeValor.split(' ');

    for (let i = 0; i < separar.length; ++i) {
        nomeFormatado = `${separar[i].slice(0, 1).toUpperCase() + separar[i].slice(1).toLowerCase()} `
    }
    nomeFormatado = nomeFormatado.trim();
}

function verificarEmail() {
    const email = document.getElementById('ipt-email');
    const erroEmail = document.getElementById('erro-email');
    let emailValor = email.value;

    let partes = emailValor.split('@');
    
    if (partes.length === 2) {
        let primeiro = partes[0];
        let segundo = partes[1];
        let ponto = partes[1].indexOf('.');
        if (!emailValor.includes(' ') && 
            primeiro.length >= 1 && primeiro.length <= 64 &&
            segundo.length >= 1 && segundo.length <= 64 &&
            ponto >= 1 && ponto != segundo.length - 1) {
            addClass(email, 'valido');
            removeClass(email, 'invalido');
            addClass(erroEmail, 'sumir');
            passouNoEmail = true
        } else {
            addClass(email, 'invalido')
            removeClass(email, 'valido')
            if (emailValor.length >= 10) {
                removeClass(erroEmail, 'sumir')
            }
        }
    }
}

function verificarSenha(tipo) {
    const senha = document.getElementById('ipt-senha');
    const senhaConfirmar = document.getElementById('ipt-senhaConfirmar') || document.getElementById('ipt-confirmarSenha');
    const erroSenha = document.getElementById('erro-senha');
    const erroSenhaConfirmar = document.getElementById('erro-senhaConfirmar');

    let senhaValor = senha.value;
    if (tipo != 1) {
        const testarNumero = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let temNumero = false;
        const testarEspecial = ['!', '@', '#', '$', '%', '&', '*', '.'];
        let temEspecial = false;

        for(let i = 0; i < senhaValor.length; ++i){
            let atual = senhaValor[i];
            for(let e = 0; e < testarNumero.length; ++e){
                if(Number(atual) === testarNumero[e]){
                    temNumero = true;
                    break;
                }
            }

            for(let e = 0; e < testarEspecial.length; ++e){
                if(atual === testarEspecial[e]){
                    temEspecial = true;
                    break;
                }
            }
            if(temEspecial && temNumero) break;
        }

        if (senhaValor.length > 0) {
            if (senhaValor.length < 10) {
                addErro(erroSenha, `Senha menor que 10 dígitos!`)
                addClass(senha, 'invalido');
                removeClass(senha, 'valido');
            } else if (senhaValor.toLowerCase() === senhaValor || senhaValor.toUpperCase() === senhaValor) {
                addErro(erroSenha, `Senha precisa contar ao menos uma letra maiúscula ou minúscula!`);
                addClass(senha, 'invalido');
                removeClass(senha, 'valido');
            } else if (!temEspecial) {
                addErro(erroSenha, `Senha precisa conter algarismos especiais!`);
                addClass(senha, 'invalido');
                removeClass(senha, 'valido');
            } else if (senhaValor.includes(' ')) {
                addErro(erroSenha, `Senha não pode conter espaço!`);
                addClass(senha, 'invalido');
                removeClass(senha, 'valido');
            } else if (!temNumero) {
                addErro(erroSenha, 'Senha precisa conter algum número')
                addClass(senha, 'invalido');
                removeClass(senha, 'valido');
            } else {
                addClass(erroSenha, 'sumir')
                removeClass(senha, 'invalido')
                addClass(senha, 'valido')
            }
        }
    } else {
        let senhaConfirmarValor = senhaConfirmar.value;
        if (senhaConfirmarValor.length > 0) {
            if (senhaConfirmarValor != senhaValor && senhaConfirmarValor.length >= senhaValor.length) {
                addClass(senhaConfirmar, 'invalido');
                removeClass(senhaConfirmar, 'valido');
                removeClass(erroSenhaConfirmar, 'sumir');
                passouNaSenha = false;
            } else if (senhaConfirmarValor.length >= senhaValor.length) {
                addClass(senhaConfirmar, 'valido');
                removeClass(senhaConfirmar, 'invalido');
                addClass(erroSenhaConfirmar, 'sumir');
                passouNaSenha = true
            } else {
                removeClass(senhaConfirmar, 'invalido', 'valido');
                addClass(erroSenhaConfirmar, 'sumir')
                passouNaSenha = false;
            }
        }
    }
}

function ativarGenero() {
    const genero = document.getElementById('slc-genero');
    const casoOutro = document.getElementById('casoOutro');

    let generoValor = genero.value;
    passouNoGenero = true;
    if (generoValor === 'Outro') {
        removeClass(casoOutro, 'sumir');
        generoAlternativo = true;
    } else {
        addClass(casoOutro, 'sumir');
        generoAlternativo = false;
    }
}

function verificarGenero() {
    const outroGenero = document.getElementById('ipt-outroGenero');

    let outroGeneroValor = outroGenero.value;

    if (outroGeneroValor.length <= 2) {
        addClass(outroGenero, 'invalido')
        removeClass(outroGenero, 'valido')
        passouNoGenero = false;
    } else {
        addClass(outroGenero, 'valido')
        removeClass(outroGenero, 'invalido')
        passouNoGenero = true
    }
}

function verificarData() {
    const idade = document.getElementById('ipt-idade') || document.getElementById('ipt-dtNascimento');
    const erroIdade = document.getElementById('erro-idade');

    const data = new Date();
    const dataPassada = new Date(1920, 0, 1);

    let dataPassadaFormatada = `${dataPassada.getFullYear()}-${String(dataPassada.getMonth() + 1).padStart(2, '0')}-${dataPassada.getDate()}`;
    let dataFormatada = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${data.getDate()}`;

    let idadeValor = idade.value;

    if (idadeValor < dataPassadaFormatada && idadeValor.length === 10) {
        addClass(idade, 'invalido');
        removeClass(idade, 'valido');
        addErro(erroIdade, 'A ano inserido não pode ser anterior a 1920!');
        passouNaData = false;
    } else if (idadeValor >= dataFormatada || idadeValor.length > 10) {
        addClass(idade, 'invalido');
        removeClass(idade, 'valido');
        addErro(erroIdade, 'A idade não pode ser maior ou igual a data atual!');
        passouNaData = false;
    } else {
        passouNaData = true
        addClass(idade, 'valido');
        removeClass(idade, 'invalido');
        addClass(erroIdade, 'sumir')
    }
}

function limparClass() {
    const email = document.getElementById('ipt-email');
    const senha = document.getElementById('ipt-senha');
    const senhaConfirmar = document.getElementById('ipt-senhaConfirmar') || document.getElementById('ipt-confirmarSenha');
    const outroGenero = document.getElementById('ipt-outroGenero');
    const erroEmail = document.getElementById('erro-email');
    const erroSenha = document.getElementById('erro-senha');
    const erroIdade = document.getElementById('erro-idade');
    const erroSenhaConfirmar = document.getElementById('erro-senhaConfirmar');

    if (erroEmail?.classList.contains('sumir')) {
        removeClass(email, 'valido', 'invalido');
    }
    if (erroSenha?.classList.contains('sumir')) {
        removeClass(senha, 'invalido', 'valido');
    }
    if (erroSenhaConfirmar?.classList.contains('sumir')) {
        removeClass(senhaConfirmar, 'invalido', 'valido');
    }
    if (erroIdade?.classList.contains('sumir')) {
        removeClass(erroIdade, 'invalido', 'valido');
    }
    if (generoAlternativo) {
        removeClass(outroGenero, 'invalido', 'valido');
    }
}

function removeClass(i, ...c) {
    i.classList.remove(...c)
}

function addClass(i, ...c) {
    i.classList.add(...c)
}

function addErro(e, msg) {
    e.innerHTML = msg;
    removeClass(e, 'sumir');
}