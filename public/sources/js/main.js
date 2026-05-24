function cadastrar() {
   if (!passouNoNome || !passouNoEmail || !passouNaSenha || !passouNaData || !passouNoGenero) return;
 
    const generoEl = document.getElementById('slc-genero') || document.getElementById('slct-genero');
    let generoValor = generoEl.value;
    if (generoAlternativo) {
        generoValor = document.getElementById('ipt-outroGenero').value;
    }
 
    const idadeEl = document.getElementById('ipt-idade') || document.getElementById('ipt-dtNascimento');

  fetch("/usuarios/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        nome: nomeFormatado,
        email: document.getElementById('ipt-email').value,
        identidade: generoValor,
        dtNascimento: idadeEl.value,
        senha: document.getElementById('ipt-senha').value,
    }),
  })
    .then((resposta) => {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        setTimeout(() => {
          window.location = "./login.html";
        }, 2000);

        confirmacao.classList.remove("sumir"); // ! Mostrar ao usuário que foi cadastrado!
        confirmacao.classList.add("animacao");
      } else {
        throw "Houve um erro ao tentar realizar o cadastro!";
      }
    })
    .catch((e) => {
      console.log(`#ERRO: ${e}`);
    });
  return false;
}

function login() {
  fetch("/usuarios/autenticar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: document.getElementById("ipt-email").value,
      senha: document.getElementById("ipt-senha").value,
    }),
  })
    .then((resposta) => {
      if (resposta.ok) {
        resposta.json().then((token) => {
          sessionStorage.setItem("token", token.token);
          setTimeout(() => {
            window.location.href = "./index.html";
          }, 500);
        });
      } else {
        console.log("Houve um erro ao tentar realizar o login!");
        resposta.text().then((e) => {
          console.error(e);
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });

  return false;
}
