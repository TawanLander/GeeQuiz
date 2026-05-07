const usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    let email = req.body.email;
    let senha = req.body.senha;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(token => {
                if (!token) return res.status(400).send('Você não tem cadastro!'); // SE TOKEN RETORNAR FALSE ELE RETORNA E DA ERRO
                res.json({
                    token: token
                });
            }).catch(erro => {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    let nome = req.body.nome;
    let email = req.body.email;
    let senha = req.body.senha;
    let identidade = req.body.identidade;
    let dtNascimento = req.body.dtNascimento;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (dtNascimento == undefined) {
        res.status(400).send("Sua data de nascimento está undefined!");
    } else if (identidade == undefined) {
        res.status(400).send("Seu identidade está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, email, identidade, dtNascimento, senha)
            .then(resultado => {
                res.json(resultado);
            }).catch(erro => {
                console.log(erro);
                console.log(`\nHouve um erro ao realizar o cadastro! Erro: ${erro.sqlMessage}`);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function informacoes(req, res) {
    usuarioModel.informacoes(req, res).then(r => {
        res.status(200).json(r);
    }).catch(e => {
        res.status(400).json(e.sqlMessage);
    });
}

function excluir(req, res, idUsuario) {
    if (idUsuario === undefined) {
        return res.status(400).send('Id undefined, impossível de continuar!')
    }

    usuarioModel.excluir(idUsuario).then(resultado => {
        return res.status(200).json(resultado);
    }).catch(e => {
        console.log(e.sqlMessage);
        return res.status(400).send(`Erro ao deletar! ${e.sqlMessage}`);
    });

}

async function verificar(req, res, token) {
    try {
        const model = await usuarioModel.verificar(token);
        if(!model) return res.status(400).send(false);
        
        if (model.situacao === 'Expirado') { // ? USUÁRIO CAIU NA MALHA FINA E SERÁ EXCLUÍDO

            const array = usuarioModel.usuariosLogados; // ? PEGA O ARRAY DOS USUÁRIO LOGADOS
            const user = array.find((user) => user.token === token); // ? ACHA O USUÁRIO ATUAL
            array.splice(array.indexOf(user), 1); // ? RETIRA ELE DO ARRAY, ENCERRANDO A CONEXÃO DELE

            const deletar = await usuarioModel.deletar(token);

            return false;
        }

        const atualizar = await usuarioModel.atualizar(token); // ? ELSE SE SITUAÇÃO VIER COMO RENOVADO

        return true; // ? USUÁRIO FOI VERIFICADO COM SUCESSO
    } catch (e) {
        console.log(e);
    }
}

async function deslogar(req, res, id) {
    try {
        const deslogar = await usuarioModel.deslogar(id);
        if (!deslogar) return res.status(400).send(false);

        res.status(200).send('Usuário deletado!');
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

module.exports = {
    autenticar,
    cadastrar,
    informacoes,
    excluir,
    verificar,
    deslogar
}