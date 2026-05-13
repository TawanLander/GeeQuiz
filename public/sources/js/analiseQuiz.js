async function carregarQuizAnalisado(id) {
    const perguntas = await fetch('/quizes/perguntas', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            fkQuiz: id
        })
    });

    if (!perguntas.ok) return window.location.href = './conta.html'

    const opcoes = await fetch('/quizes/opcoes', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            fkQuiz: id
        })
    })

    if(!opcoes.ok) return window.location.href = './conta.html'

    console.log(await perguntas.json())
    console.log(await opcoes.json())
}