const tituloQuiz = document.getElementById('quiz-titulo');
const generoQuiz = document.getElementById('quiz-genero');
const tipoQuiz = document.getElementById('quiz-tipo');
const imgQuiz = document.getElementById('quiz-img');
const modificacoesQuiz = document.getElementById('quiz-modificacoes');
const erroQuiz = document.getElementById('quiz-erro');
const erroQuizTitulo = document.getElementById('quiz-erro-titulo');

const perguntasArray = []; // ARRAY GLOBAL PARA INSERIR QUANTAS PERGUNTAS QUISER, LENGTH MAX: 25
let perguntaAtual = 0; // VE A PERGUNTA ATUAL DO USUÁRIO, CASO ELE VOLTE PARA OUTRA PERGUNTA

var erro = false;

async function montagemQuiz(i) {
    const nomeUsuario = await verificarSessao('nome')

    if (i === 1) { // TÍTULO DO QUIZ
        if (tituloQuiz.value != '') {
            let valor = (tituloQuiz.value).slice(0, 1).toUpperCase() + (tituloQuiz.value).slice(1);

            document.getElementById('titulo-quiz-template').innerHTML = valor;

            if (tituloQuiz.value.length < 7) {
                erroQuizTitulo.classList.add('show');
                erroQuizTitulo.classList.remove('sumir');
                erro = true;
            } else {
                erroQuizTitulo.classList.remove('show');
                erroQuizTitulo.classList.add('sumir');
                erro = false;
            }
        } else {
            erro = false;
            document.getElementById('titulo-quiz-template').innerHTML = 'Insira o título';
        }
    } else if (i === 2) { // GÊNERO DO QUIZ
        document.getElementById('genero-quiz-template').innerHTML = `Gênero: ${generoQuiz.value}`;
    } else if (i === 3) { // TIPO DO QUIZ
        document.getElementById('tipo-quiz-template').innerHTML = `Tipo: ${tipoQuiz.value}`;
    } else if (i === 4) { // IMAGEM DO QUIZ
        document.getElementById('img-quiz-template').src = imgQuiz.value;
    } else { // NOME DO USUÁRIO QUE CRIOU O QUIZ
        document.getElementById('nome-quiz-template').innerHTML = `Feito por: ${nomeUsuario}`
    }
}

function montagemPergunta() {
    const imgPergunta = document.getElementById('pergunta-img');

    // IMAGEM DA PERGUNTA
    let img = document.getElementById('img-pergunta-template');
    if (!img) return;
    img.src = imgPergunta.value;
}

function menuPerguntas(o) {

    erroQuiz.innerHTML = '';
    // VENDO SE TEM POSSÍVEIS ERROS NO TEMPLATE DO QUIZ ANTES DE PROSSEGUIR
    if (tituloQuiz.value === '' || generoQuiz.value === 'Selecione alguma opção!' || tipoQuiz.value === 'Selecione alguma opção!' || imgQuiz.value === '') {
        erroQuiz.classList.remove('sumir');
        erroQuiz.innerHTML = 'Insira todos os valores acima para prosseguir'
    } else if (erro) {
        erroQuiz.classList.remove('sumir');
        erroQuiz.innerHTML = 'Verifique os campos acima! Há erros.'
    } else {
        erroQuiz.classList.add('sumir');
        // ELSE SE NÃO TIVER 
        // i == 'ir' v == 'voltar'
        if (o === 'i') {
            document.getElementById('criar-quiz').classList.add('sumir');
            document.getElementById('criar-perguntas').classList.remove('sumir');
            adicionarMarcadores()
        } else {
            document.getElementById('criar-quiz').classList.remove('sumir');
            document.getElementById('criar-perguntas').classList.add('sumir');
        }
    }

}

function adicionarMarcadores() {

    const navegacao = document.getElementsByClassName('navegacao')[0];
    let tamanho = perguntasArray.length

    if (tamanho === 0) {
        navegacao.innerHTML = `
            <div class="passar">
            <button onclick="salvarPergunta()">Próxima Pergunta</button>
            <button onclick="terminarQuiz()">Terminar Quiz</button>
            </div>
            `
    } else if (tamanho <= 4) { // MAX DE PERGUNTAS: 25
        navegacao.innerHTML = `
            <button>Voltar Pergunta</button>
            <div class="passar">
            <button onclick="salvarPergunta()">Próxima Pergunta</button>
            </div>
            `
    } else if (tamanho < 25) {
        navegacao.innerHTML = `
            <button>Voltar Pergunta</button>
            <div class="passar">
            <button onclick="salvarPergunta()">Próxima Pergunta</button>
            <button onclick="terminarQuiz()">Terminar Quiz</button>
            </div>
            `
    } else {
        navegacao.innerHTML = `
            <button>Voltar Pergunta</button>
            <div class="passar">
            <button onclick="terminarQuiz()">Terminar Quiz</button>
            </div>
            `
    }
}

function adicionarOpcao() {
    const div = document.getElementsByClassName('opcoes');
    const opcao = document.getElementsByClassName('opcao')
    const label1 = document.getElementById('label-1');
    const label2 = document.getElementById('label-2');
    const label3 = document.getElementById('label-3');

    if (label1.classList.contains('sumir')) {
        label1.classList.remove('sumir');
    } else if (label2.classList.contains('sumir')) {
        label2.classList.remove('sumir');
    } else if (label3.classList.contains('sumir')) {  // REMOVE O BOTÃO SE A QUANTIDADE DE OPÇÕES FOR A MÁXIMA OU SEJA LABEL 3
        label3.classList.remove('sumir');
        document.getElementsByClassName('btn')[0].classList.add('sumir');
    }
}

function retirarOpcao(i) {
    document.getElementById(i).classList.add('sumir');
    document.getElementsByClassName('btn')[0].classList.remove('sumir');
}

function salvarPergunta() {

    let pergunta = document.getElementById('titulo-pergunta');

    let imagem = document.getElementById('pergunta-img')

    const opcao = document.querySelectorAll('.ipt-opcao');

    const checkbox = document.querySelectorAll('input[type="checkbox"]');
    let verdadeiros = 0;
    checkbox.forEach(e => {
        if (e.checked) verdadeiros++;
    });
    const label1 = document.getElementById('label-1');
    const label2 = document.getElementById('label-2');
    const label3 = document.getElementById('label-3');

    let erro = document.getElementById('erro-passar');

    if (pergunta.value.length < 10) { // VERIFICA SE O TAMANHO DO TÍTUL ODA PERGUNTA É MAIOR QUE 10
        erro.innerHTML = 'O título deve conter ao menos 10 caracteres'
        erro.classList.remove('sumir');
    } else if (imagem.value === '') { // VERIFICA SE O INPUT DA IMAGEM NÃO É NULO (ARRUMAREI DEPOIS PARA VER SE A IMAGEM REALMENTE CARREGA)
        erro.innerHTML = 'Deve haver alguma imagem na pergunta'
        erro.classList.remove('sumir');
    } else if (opcao[0].value.length <= 2) { // ENTRA NOS PARÂMETROS DE VERIFICAÇÃO DOS INPUTS OBRIGATÓRIOS (OS 3 PRIMEIROS)
        erro.innerHTML = 'A 1º opção deve ser preenchida com ao menos 2 caracteres'
        erro.classList.remove('sumir');
    } else if (opcao[1].value.length <= 2) {
        erro.innerHTML = 'A 2º opção deve ser preenchida com ao menos 2 caracteres'
        erro.classList.remove('sumir');
    } else if (opcao[2].value.length <= 2) {
        erro.innerHTML = 'A 3º opção deve ser preenchida com ao menos 2 caracteres'
        erro.classList.remove('sumir');
    } else if (!label1.classList.contains('sumir') && opcao[3].value.length <= 2) { // ENTRA NOS PARÂMETROS DE VERIFICAÇÃO DOS INPUTS OPCIONAIS (OS 3 ÚLTIMOS), VẼ SE ELES NÃO TEM A CLASSE "SUMIR" POIS SIGNIFICA QUE NÃO ESTARIAM SENDO USADOS;
        erro.innerHTML = 'A 4º opção deve ser preenchida com ao menos 2 caracteres ou deve ser excluída!'
        erro.classList.remove('sumir');
    } else if (!label2.classList.contains('sumir') && opcao[4].value.length <= 2) {
        erro.innerHTML = 'A 5º opção deve ser preenchida com ao menos 2 caracteres ou deve ser excluída'
        erro.classList.remove('sumir');
    } else if (!label3.classList.contains('sumir') && opcao[5].value.length <= 2) {
        erro.innerHTML = 'A 6º opção deve ser preenchida com ao menos 2 caracteres ou deve ser excluída'
        erro.classList.remove('sumir');
    } else if (verdadeiros < 1) {
        erro.innerHTML = 'Ao menos uma opção deve ser a correta!'
        erro.classList.remove('sumir');
    } else {
        erro.classList.add('sumir');

        let json = {};

        if (verdadeiros > 1) {
            json.tipo = 'm'
        } else {
            json.tipo = 'n'
        };
        
        let formatar = pergunta.value.substring(0, 1).toUpperCase() + pergunta.value.substring(1);

        const iptOpcao = document.querySelectorAll('.ipt-opcao');

        json.titulo = formatar;
        json.imagem = imagem.value
        json.opcoes = [
            { titulo: iptOpcao[0].value, verdadeiro: checkbox[0].checked },
            { titulo: iptOpcao[1].value, verdadeiro: checkbox[1].checked },
            { titulo: iptOpcao[2].value, verdadeiro: checkbox[2].checked }
        ];


        if (!label1.classList.contains('sumir')) {
            json.opcoes.push({ titulo: iptOpcao[3].value, verdadeiro: checkbox[3].checked });
        }

        if (!label2.classList.contains('sumir')) {
            json.opcoes.push({ titulo: iptOpcao[4].value, verdadeiro: checkbox[4].checked });
        }

        if (!label3.classList.contains('sumir')) {
            json.opcoes.push({ titulo: iptOpcao[5].value, verdadeiro: checkbox[5].checked });
        }

        // CONFIGURANDO TUDO PARA A PRÓXIMA PERGUNTA
        perguntasArray.push(json);
        console.log(json);
        pergunta.value = '';
        imagem.value = '';
        document.getElementById('img-pergunta-template').src = '';
        label1.classList.add('sumir');
        label2.classList.add('sumir');
        label3.classList.add('sumir');
        opcao.forEach(e => {
            e.value = '';
        });
        checkbox.forEach(e => {
            e.checked = false;
        });
        adicionarMarcadores(); // APÓS CLICAR TERMINAR DE ADICIONAR TUDO, DEVE-SE VERIFICAR OS MARCADORES DE BAIXO DAS PERGUNTAS
    }
}

function formatarTitulo() {
    let pergunta = document.getElementById('titulo-pergunta');
    let formatar = pergunta.value.substring(0, 1).toUpperCase() + pergunta.value.substring(1);

    pergunta.value = formatar;
}

async function terminarQuiz() {

    salvarPergunta();

    const fetchInformacao = await fetch('/quizes/informacao',{
        headers: {
            'token': sessionStorage.getItem('token')
        }
    }).then(r => {
        if (r.ok) {
            return r.json()
        } else {
            throw new Error(`Erro no Fetch Informação! ${r.status}`);
        }
    });

    let id = fetchInformacao[0]['id'];

    const fetchQuiz = await fetch('/quizes/cadastrar/quiz', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            id: Number(id),
            titulo: tituloQuiz.value,
            imagem: imgQuiz.value,
            genero: generoQuiz.value,
            tipo: tipoQuiz.value,
        })
    })

    if (!fetchQuiz.ok) {
        throw new Error(`Erro no Fetch Cadastrar Quiz! ${fetchQuiz.status}`);
    }

    for (let i = 0; i < perguntasArray.length; ++i) {
        const titulo = perguntasArray[i].titulo;
        const imagem = perguntasArray[i].imagem;
        const tipo = perguntasArray[i].tipo;
        const opcoes = perguntasArray[i].opcoes;

        const fetchPerguntas = await fetch('quizes/cadastrar/perguntas', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                id: i + 1,
                titulo: titulo,
                imagem: imagem,
                tipo: tipo,
                fkQuiz: Number(id)
            })
        })

        if (!fetchPerguntas.ok) {
            throw new Error(`Erro no Fetch Cadastrar Perguntas! ${fetchPerguntas.status}`);
            console.log(fetchPerguntas.text());
        }

        for (let e = 0; e < opcoes.length; ++e) {
            let tinyint = 0;

            if(opcoes[e].verdadeiro){
                tinyint = 1
            };

            const fetchOpcoes = await fetch('/quizes/cadastrar/opcoes', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'token': sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    id: e + 1,
                    fkPerguntas: i + 1,
                    fkQuiz: Number(id),
                    titulo: opcoes[e].titulo,
                    verdadeiro: tinyint
                })
            })

            if (!fetchOpcoes.ok) {
                throw new Error(`Erro no Fetch Cadastrar Opcoes" ${fetchOpcoes.status}`);
            }
        }

    }

    const confirmacao = document.getElementById('confirmacao');

    confirmacao.classList.add('aparecer');
    confirmacao.classList.remove('sumir');

    const perguntas = document.getElementById('criar-perguntas');
    perguntas.classList.add('sumir');

    setTimeout(() => {
        window.location.href = './index.html'
    }, 3000);
}