function cadastrar() {
    let generoValor = document.getElementById('slc-genero').value;
    if(generoAlternativo){
        generoValor = document.getElementById('ipt-outroGenero').value;
    }

    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome: nome.value,
            email: email.value,
            identidade: generoValor,
            dtNascimento: idade.value,
            senha: senha.value
        }),
    }).then(resposta => {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
            setTimeout(() => {
                window.location = "./login.html";
            }, "2000");

            confirmacao.classList.remove('sumir'); // ! Mostrar ao usuário que foi cadastrado!
            confirmacao.classList.add('animacao');
        } else {
            throw "Houve um erro ao tentar realizar o cadastro!";
        }
    }).catch(e => {
        console.log(`#ERRO: ${e}`);
    });
    return false;
}

function login() {
    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email.value,
            senha: senha.value
        })
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then(token => {
                sessionStorage.setItem('token', token.token)
                setTimeout(() => {
                    window.location.href = "./index.html";
                }, 500);
            });
        } else {
            console.log("Houve um erro ao tentar realizar o login!");
            resposta.text().then(e => {
                console.error(e);
            });
        }
    }).catch(e => {
        console.log(e);
    })

    return false;
}