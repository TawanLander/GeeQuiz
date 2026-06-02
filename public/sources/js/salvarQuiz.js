function salvarDados(p) {
    console.log(p)
    if(typeof(p) === Object){
        p = p[0];
    }

    fetch('/quizes').then(response => {
        if (response.ok) {
            response.json().then(r => {
                r.reverse();
                sessionStorage.setItem(`quiz`, p)
            })
        } else {
            console.error('Erro na coleta de dados SALVARQUIZ.JS')
        }
    });
}