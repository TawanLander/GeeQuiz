const express = require('express');
const router = express.Router();

const controller = require('../controllers/quizController');
const usuarioController = require('../controllers/usuarioController');

async function verificarToken(req, res) { // ! FUNÇÃO PADRÃO PARA VERIFICAR O TOKEN DO USUÁRIO! PEGA O REQ E RES DA REQUISIÇÃO PAI E BUSCA PELO TOKEN, E PELO USUÁRIO, RETORNA UM ARRAY COM O RESULTADO DA BUSCA (TRUE || FALSE) E O USUÁRIO;
    const token = req.headers["token"]; // ? PEGA O TOKEN PELA HEADER DA REQUISIÇÃO

    if (!token) { // ? SE NÃO HOUVER TOKEN RETORNA FALSE
        return false;
    }

    const user = await usuarioController.verificar(req, res, token); // ? SE HOUVER, RETORNA O ARRAY, COM O RESULTADO DA BUSCA E O USUÁRIO
    if (!user) return false;

    return user
}

router.post('/cadastrar/quiz', async (req, res) => { // ? ROTA PARA CADASTRAR SEU QUIZ // PRECISA DE TOKEN
    // ! FUNÇÃO ASYNC PARA ESPERAR O VERIFICAR TOKEN
    const verificar = await verificarToken(req, res); // ? ENVIA O CORPO DA REQUISIÇÃO A FUNÇÃO
    if (!verificar) return res.status(400).send(false); // ? SE O TOKEN NÃO FOR VÁLIDO

    let fkUsuario = verificar.id;
    controller.cadastrarQuiz(req, res, fkUsuario);

});

// todo NEM PERGUNTAS NEM OPÇÕES PRECISAM DE TOKEN PORQUE IMPLICA QUE SE HÁ UM QUIZ, O TOKEN JÁ FOI VERIFICADO.
router.post('/cadastrar/perguntas', async (req, res) => { // ? ROTA PARA CADASTRAR AS PERGUNTAS // 
    controller.cadastrarPerguntas(req, res);
});

router.post('/cadastrar/opcoes', async (req, res) => { // ? ROTA PARA CADASTRAR AS OPCOES // 
    controller.cadastrarOpcoes(req, res);
});

router.get('/', (req, res) => { // ? ROTA PARA PLOTAR OS QUIZES NO INDEX.HTML
    controller.listarQuizes(req, res);
});

router.post('/perguntas', async (req, res) => { // ? ROTA PARA PLOTAR AS PERGUNTAS NA QUIZ.HTML // PRECISA DE TOKEN
    const verificar = await verificarToken(req, res); // ? ENVIA O CORPO DA REQUISIÇÃO A FUNÇÃO
    if (!verificar) return res.status(400).send(false); // ? SE O TOKEN NÃO FOR VÁLIDO

    controller.listarPerguntas(req, res);
});

router.post('/opcoes', async (req, res) => { // ? ROTA PARA PLOTAR AS OPCOES NA QUIZ.HTML // PRECISA DE TOKEN
    const verificar = await verificarToken(req, res); // ? ENVIA O CORPO DA REQUISIÇÃO A FUNÇÃO
    if (!verificar) return res.status(400).send(false); // ? SE O TOKEN NÃO FOR VÁLIDO

    controller.listarOpcoes(req, res);
});

router.get('/informacao', async (req, res) => { // ? ROTA PARA PEGAR O PRÓXIMO ID DO QUIZ (ESSENCIAL PARA CADASTRAR AS PERGUNTAS E OPÇÕES COM A FK) // PRECISA DE TOKEN
    const verificar = await verificarToken(req, res); // ? ENVIA O CORPO DA REQUISIÇÃO A FUNÇÃO
    if (!verificar) return res.status(400).send(false); // ? SE O TOKEN NÃO FOR VÁLIDO

    controller.listarInformacoes(req, res);
})

router.post('/deletar', async (req, res) => {
    const verificar = await verificarToken(req, res); // ? ENVIA O CORPO DA REQUISIÇÃO A FUNÇÃO
    if (!verificar) return res.status(400).send(false); // ? SE O TOKEN NÃO FOR VÁLIDO

    if (verificar.cargo === 'a') {
        controller.deletar(req, res) // ? ROTA PARA DELETAR O QUIZ (SOMENTE ADMINISTRADORES) // PRECISA DE TOKEN
    } else {
        return res.status(400).send('Você não possui permissões!')
    }
});

router.get('/gostei', async (req, res) => {
    const verificar = await verificarToken(req, res); // ? ENVIA O CORPO DA REQUISIÇÃO A FUNÇÃO
    if (!verificar) return res.status(400).send(false); // ? SE O TOKEN NÃO FOR VÁLIDO

    controller.gostei(req, res);
});

router.post('/terminar', async (req, res) => {
    const verificar = await verificarToken(req, res); // ? ENVIA O CORPO DA REQUISIÇÃO A FUNÇÃO
    if (!verificar) return res.status(400).send(false); // ? SE O TOKEN NÃO FOR VÁLIDO

    const idUsuario = verificar.id;
    controller.terminar(req, res, idUsuario);
});

router.get('/completos', async (req, res) => {
    const verificar = await verificarToken(req, res); // ? ENVIA O CORPO DA REQUISIÇÃO A FUNÇÃO
    if (!verificar) return res.status(400).send(false); // ? SE O TOKEN NÃO FOR VÁLIDO

    controller.completos(req, res, verificar.id);
});

module.exports = router;