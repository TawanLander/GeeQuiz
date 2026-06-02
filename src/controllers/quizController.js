const quiz = require('../models/quizModel');

function listarInformacoes(req, res) {
    quiz.listarInformacoes().then(resultado => {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    });
}

function listarQuizes(req, res) {
    quiz.listarQuizes().then(resultado => {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    });
};

function listarPerguntas(req, res) {
    let fk = req.body.fkQuiz;
    if (fk === undefined) {
        return res.status(400).send('fk undefined')
    }

    quiz.listarPerguntas(fk).then(resultado => {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    });
};

function listarOpcoes(req, res) {
    let fk = req.body.fkQuiz;
    if (fk === undefined) {
        return res.status(400).send('fk undefined')
    }

    quiz.listarOpcoes(fk).then(resultado => {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    });
};

function cadastrarQuiz(req, res, fkUsuario) {
    let id = req.body.id;
    let titulo = req.body.titulo;
    let imagem = req.body.imagem;
    let genero = req.body.genero;
    let tipo = req.body.tipo;

    if (titulo === undefined) {
        return res.status(400).send("Seu nome está incorreto");
    } else if (id === undefined) {
        return res.status(400).send("Seu id está incorreto")
    } else if (imagem === undefined) {
        return res.status(400).send("Sua imagem está incorreta")
    } else if (genero === undefined) {
        return res.status(400).send("Seu genero está incorreto")
    } else if (tipo === undefined) {
        return res.status(400).send("Seu tipo está incorreto")
    }

    quiz.cadastrarQuiz(id, titulo, imagem, genero, tipo, fkUsuario).then(() => {
        return res.status(200).send("Quiz Criado!")
    }).catch(function (erro) {
        return res.status(500).json(erro.sqlMessage);
    });
};

function cadastrarPerguntas(req, res) {
    let id = req.body.id;
    let titulo = req.body.titulo;
    let imagem = req.body.imagem;
    let tipo = req.body.tipo;
    let fkQuiz = req.body.fkQuiz;

    if (id === undefined) {
        return res.status(400).send('Seu id está incorreto');
    } else if (titulo === undefined) {
        return res.status(400).send('Seu título está incorreto');
    } else if (imagem === undefined) {
        return res.status(400).send('Sua imagem está incorreta');
    } else if (tipo === undefined) {
        return res.status(400).send('Seu tipo está incorreto');
    } else if (fkQuiz === undefined) {
        return res.status(400).send('Seu fkQuiz está incorreto');
    }

    quiz.cadastrarPerguntas(id, titulo, imagem, tipo, fkQuiz).then(r => {
        return res.status(200).send('Pergunta Criada')
    }).catch(e => {
        return res.status(500).json(e.sqlMessage);
    });
}

function cadastrarOpcoes(req, res) {
    let id = req.body.id
    let fkPerguntas = req.body.fkPerguntas;
    let fkQuiz = req.body.fkQuiz;
    let titulo = req.body.titulo;
    let verdadeiro = req.body.verdadeiro;

    if (id === undefined) {
        return res.status(400).send('Seu id está incorreto')
    } else if (fkPerguntas === undefined) {
        return res.status(400).send('Seu fkPerguntas está incorreto')
    } else if (fkQuiz === undefined) {
        return res.status(400).send('Seu fkQuiz está incorreto')
    } else if (titulo === undefined) {
        return res.status(400).send('Seu titulo está incorreto')
    } else if (verdadeiro === undefined) {
        return res.status(400).send('Seu verdadeiro está incorreto')
    }

    quiz.cadastrarOpcoes(id, fkPerguntas, fkQuiz, titulo, verdadeiro).then(() => {
        return res.status(200).send('Opção criada!')
    }).catch(e => {
        return res.status(500).json(e.sqlMessage);
    });
}

function deletar(req, res) {
    let id = req.body.id;

    if (id === undefined) {
        return res.status(400).send('Seu id está incorreto')
    }

    quiz.deletar(id).then(() => {
        return res.status(200).send('Quiz Deletado!')
    }).catch(e => {
        return res.status(500).json(e.sqlMessage);
    })
}

function gostei(req, res, idUsuario) {
    let idQuiz = req.body.idQuiz;

    if (idQuiz === undefined) {
        return res.status(400).send('Seu id está incorreto')
    }

    quiz.gostei(idUsuario, idQuiz).then(() => {
        return res.status(200).send('Gostei Enviado')
    }).catch(e => {
        return res.status(500).json(e.sqlMessage);
    })
}

async function verificarGostei(req, res, idUsuario) {
    let idQuiz = req.body.idQuiz;

    if (idQuiz === undefined) {
        return res.status(400).send('Seu id está incorreto')
    }
    const result = await quiz.verificarGostei(idUsuario, idQuiz)

    if(result === 'Sem like') return res.status(200).send('Sem like')

    return res.status(200).send('Com like');
}

function terminar(req, res, idUsuario) {
    let idQuiz = req.body.fkQuiz;
    let array = req.body.array;

    if (idQuiz === undefined) {
        return res.status(400).send('Você não tem um id válido!')
    } else if (array === undefined) {
        return res.status(400).send('Você não tem um array válido!')
    }

    quiz.terminar(idQuiz, idUsuario, array).then(() => {
        return res.status(200).send('Quiz Concluído com sucesso!')
    }).catch(e => {
        console.log(`Erro completo: ${e}`);
        return res.status(500).json(e.sqlMessage);
    })
}

async function completos(req, res, id) {
    const quizes = await quiz.completos(id);
    if (!quizes) return res.status(400).send(false);

    res.status(200).json(quizes);
}

async function selecionados(req, res, idUsuario) {
    let id = req.body.fkQuiz;

    if (id === undefined) return res.status(400).send('Id undefined!');

    const selecionados = await quiz.selecionados(id, idUsuario)
    if (!selecionados) return res.status(400).send(false);

    res.status(200).json(selecionados);
}

module.exports = {
    listarInformacoes,
    listarQuizes,
    listarPerguntas,
    listarOpcoes,
    cadastrarQuiz,
    cadastrarPerguntas,
    cadastrarOpcoes,
    deletar,
    gostei,
    terminar,
    completos,
    selecionados,
    verificarGostei
};