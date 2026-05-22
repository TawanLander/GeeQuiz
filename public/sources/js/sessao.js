async function verificarSessao(causa) {
  const token = sessionStorage.getItem("token");

  if (token) {
    // ?  VERIFICA SE TEM UM TOKEN PARA TENTAR DAR O FETCH
    const resposta = await fetch("/usuarios/verificar", {
      headers: {
        'token': token,
      },
    });
    // ! SE A CAUSA FOR COMUM (SEM PARÂMETRO) SIGNIFICA Q O USUÁRIO SÓ NÃO ESTÁ LOGADO, CASO FOR ESPECIAL, SIGNIFICA QUE NÃO HÁ PERMISSÕES PARA ESSE USUÁRIO
    if (!resposta.ok && causa === "redirecionar") window.location.href = "./index.html"; // ? SE TEM CAUSA SIGNIFICA QUE É POR ALGUM MOTIVO QUE O USUÁRIO FOI REDIRECIONADO
    if (!resposta.ok) return false; // ? SE NÃO TEM RESPOSTA RETORNA FALSE (PARA PLOTAGEM DA HEADER, FOOTER E QUIZES)

    const r = await resposta.json();

    if (causa === "cargo") return r.cargo;
    if (causa === "nome") return r.nome;

    if (causa === "especial" && r.cargo === "p")
      return (window.location.href = "./index.html");

    return true;
  }

  if(causa === 'redirecionar') window.location.href = './index.html'
}
