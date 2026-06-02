const quiz = JSON.parse(sessionStorage.getItem('quizModel'));

function deletarQuiz() {
    let imagem = document.querySelector('img');
    let h1 = document.querySelectorAll('h1');
    let div = document.querySelectorAll('.content')

    h1[1].textContent = quiz.titulo;

    imagem.src = quiz.imagem;

    div[0].textContent = quiz.genero;
    div[1].textContent = quiz.tipo;
    div[2].textContent = quiz.qtdPerguntas;
    div[3].textContent = quiz.gostados;
    div[4].textContent = quiz.feitoPor;
}

async function remover() {
    const confirmacao = document.querySelector('.confirmacao');
    try{

        const deletar = await fetch('/quizes/deletar', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                token: sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                id: quiz.id
            })
        });
    
        if (!deletar.ok) {
            confirmacao.innerHTML = `<h1>Erro! Tente novamente!</h1>`
            confirmacao.classList.remove('sumir');
    
            setTimeout(() => {
                confirmacao.classList.add('sumir');
                confirmacao.innerHTML = ``
            }, 2000)
    
            return;
        }
    
        confirmacao.innerHTML = `<h1>Sucesso! Quiz deletado. <br> Redirecionando para a página principal!</h1>`
        confirmacao.classList.remove('sumir');
        sessionStorage.removeItem('quizModel');
    
        setTimeout(() => {
            window.location.href = './index.html'
        }, 1500)
    }catch(e){
        console.error(e)
    }
}

function voltar() {
    sessionStorage.removeItem('quizModel');
    window.location.href = './index.html'
}

window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('quizModel');
})