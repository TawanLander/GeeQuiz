const bd = require("../database/config");

function listarInformacoes() {
  let query = "select max(idQuiz) + 1  as id from quiz";
  return bd.executar(query);
}

function listarQuizes() {
  let query = `select quiz.*, usuario.nome, count(perguntas.id) as qtd
    from quiz 
    left join usuario on usuario.idUsuario = quiz.fkUsuario 
    join perguntas on perguntas.fkQuiz = quiz.idQuiz
    group by quiz.idQuiz
    order by quiz.gostados`;
  return bd.executar(query);
}

function listarPerguntas(fk) {
  let query = `select * from perguntas where ? = fkQuiz`;
  return bd.executar(query, [fk]);
}

function listarOpcoes(fk) {
  let query = `select * from opcoes where ? = fkQuiz`;
  return bd.executar(query, [fk]);
}

function cadastrarQuiz(id, titulo, imagem, genero, tipo, fkUsuario) {
  let query = `insert into quiz (idQuiz, titulo, imagem, genero, tipo, fkUsuario) values (?, ?, ?, ?, ?, ?)`;

  return bd.executar(query, [id, titulo, imagem, genero, tipo, fkUsuario]);
}

function cadastrarPerguntas(id, titulo, imagem, tipo, fkQuiz) {
  let query = `insert into perguntas (id, titulo, imagem, tipo, fkQuiz) values (?, ?, ?, ?, ?)`;

  return bd.executar(query, [id, titulo, imagem, tipo, fkQuiz]);
}

function cadastrarOpcoes(id, fkPerguntas, fkQuiz, titulo, verdadeiro) {
  let query = `insert into opcoes (id, fkPerguntas, fkQuiz, titulo, tipo) values (?, ?, ?, ?, ?)`;

  return bd.executar(query, [id, fkPerguntas, fkQuiz, titulo, verdadeiro]);
}

async function deletar(id) {
  let query = `delete from quiz where idQuiz = ?`;

  return bd.executar(query, [id]);
}

function gostei(id) {
  let query = "update quiz set gostados = gostados + 1 where idQuiz = ?";

  return bd.executar(query, [id]);
}

async function terminar(idQuiz, idUsuario, array) {
  let query = `
    select count(*) + 1 as proximo 
    from quizes_completos 
    where fkUsuario = ? and fkQuiz = ?
  `;
  const idProximoQuiz = await bd.executar(query, [idUsuario, idQuiz]); 

  query = "insert into quizes_completos (id, fkQuiz, fkUsuario) values (?, ?, ?)";
  const resultado = await bd.executar(query, [idProximoQuiz[0].proximo, idQuiz, idUsuario]); // ? INSERIR OS DADOS PRIMEIRAMENTE NA TEBELA QUIZES CONCLUÍDOS, JÁ COM DATA E HORA

  query = "insert into acertos (fkQuizesCompletos, fkQuiz, fkUsuario, fkPerguntas, fkOpcoes, selecionado) values (?, ?, ?, ?, ?, ?)";

  for (let i = 0; i < array.length; ++i) { // ? CONTA CADA PERGUNTA
    let fkPerguntas = i + 1; // * É O ID DA CADA PERGUNTA, COMO SEMPRE A PRIMEIRA SERÁ 0, SÓ SOMAMOS 1

    for (let e = 0; e < array[i].acertos.length; ++e) { // ? CONTA CADA OPÇÃO
      let fkOpcao = e + 1; // * MESMA IDEIA DO FKPERGUNTAS
      let selecionou = array[i].acertos[e].selecionado; // ! ELE PEGA O ARRAY DO FRONT E VERIFICA SE O USUÁRIO SELECIONOU AQUELA OPÇÃO, COMO RETORNA TRUE || FALSE, TRATAMOS ABAIXO JÁ QUE O MYSQL TEM O CAMPO TINYINT (0 || 1)

      if (selecionou) { // * RETORNA BOOLEANA, ENTÃO NÃO HÁ NECESSIDADE DE COMPARAÇÃO
        selecionou = 1; // * SELECIONADO
      } else {
        selecionou = 0; // * NÃO SELECIONADO
      }

      await bd.executar(query, [idProximoQuiz[0].proximo, idQuiz, idUsuario, fkPerguntas, fkOpcao, selecionou]); // ? AWAIT NECESSÁRIO PARA O FOR NÃO TENTAR DAR VÁRIOS INSERTS AO MESMO TEMPO
    }
  }
}

function completos(id) {
  let query = `
  select usuario.nome, quiz.titulo, quiz.tipo, quiz.imagem, quiz.genero, quiz.gostados, quiz.idQuiz as id, count(perguntas.id) as qtd
    from quiz 
      join quizes_completos 
        on quizes_completos.fkQuiz = quiz.idQuiz 
      join usuario
        on usuario.idUsuario = quiz.fkUsuario
      join perguntas
        on quiz.idQuiz = perguntas.fkQuiz
    where quizes_completos.fkUsuario = ?
    group by quiz.idQuiz;`

  return bd.executar(query, [id]);
}

function selecionados(idQuiz, idUsuario){
  let query = `
  select quizes_completos.dthr as data, acertos.fkQuizesCompletos as tentativa, acertos.fkPerguntas as pergunta, acertos.fkOpcoes as opcao, acertos.selecionado as selecionado, opcoes.tipo as tipo 
    from acertos 
      join opcoes 
        on acertos.fkOpcoes = opcoes.id 
        and acertos.fkPerguntas = opcoes.fkPerguntas
        and acertos.fkQuiz = opcoes.fkQuiz 
      join quizes_completos
        on quizes_completos.id = acertos.fkQuizesCompletos
    where acertos.fkQuiz = ? 
      and acertos.fkUsuario = ?
    order by acertos.fkQuizesCompletos, acertos.fkOpcoes
  `

  return bd.executar(query, [idQuiz, idUsuario]);
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
  selecionados
};