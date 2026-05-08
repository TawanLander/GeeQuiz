var bd = require("../database/config"); // ! IMPORTA O BANCO DE DADOS PARA O ARQUIVO
const usuariosLogados = []; // ! ARRAY COM TODOS OS DADOS DOS USUÁRIOS LOGADOS, PARA VALIDAÇÃO DE CARGO E IMPEDIR RASTREIO DE DADOS

function gerarToken() {
  // ! FUNÇÃO CHAMADA AO AUTENTIAR O USUÁRIO, GERA UM TOKEN ALEATÓRIO E ENVIA APENAS ELE PARA O SESSION STORAGE, IMPEDINDO O RASTREIO DE DADOS E MANIPULAÇÃO DE PERMISSÕES

  // ? BASICAMENTE GERO TRÊS VALORES ALEATÓRIOS, OS DOIS PRIMEIROS REALIZARAM UMA OPERAÇÃO, QUE É DEFINIDA PELO VALOR DO TERCEIRO
  const t1 = Math.random();
  const t2 = Math.random();

  const operacao = Math.random(); // * INDICA A OPERAÇÃO A SER REALIZADA

  let r1;

  if (operacao < 0.25) {
    r1 = t1 + t2;
  } else if (operacao < 0.5) {
    r1 = t1 - t2;
  } else if (operacao < 0.75) {
    r1 = t1 * t2;
  } else {
    r1 = t1 / t2;
  }

  let token = (r1 * new Date().getSeconds()).toString(); // ? APÓS ISSO, O TOKEN É APENAS NÚMEROS, ENTÃO TRANSFORME ELE EM STRING PARA INSERIR CARACTERES NO MEIO

  function inserirNoMeio(valor, posicao, caracter) {
    // ! FUNÇÃO QUE AGILIZA NA HORA DE INSIRIR CARACTERES
    return valor.slice(0, posicao) + caracter + valor.slice(posicao);
  }

  // ? TODOS ESSES ARRAYS REPRESENTAM POSSÍVEIS CARACTERES A SEREM INSERIDOS NO TOKEN
  const letrasMaiusculas = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  const letrasMinusculas = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

  const caracteresEspeciais = ["!", "@", "#", "$", "%", "¨", "&", "*", "(", ")", "-", "_", "+", "=", "[", "]", "{", "}", "|", "/", "?", ">", "<", ",", ".", "~", "^", "`", ":", ";", "§", "°", "ª", "º", "£", "¢", "¬", "¤", "±", "©", "®", "÷", "«", "»", "¿", "¡", "ç", "Ç", "ã", "Ã", "õ", "Õ", "á", "Á", "é", "É", "í", "Í", "ó", "Ó", "ú", "Ú", "â", "Â", "ê", "Ê", "î", "Î", "ô", "Ô", "û", "Û", "à", "À", "ü", "Ü"];

  const numeros = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  // ? TODOS OS FOR'S FAZEM A MESMA COISA, GIRAM 30 VEZES, INSERINDO A CADA REPETIÇÃO, UM VALOR ALEATÓRIO DO ARRAY INDICADO, NO TOKEN FINAL
  for (let i = 0; i < 30; ++i) {
    // * REPETE 30 VEZES
    const letraAInserir = Math.floor(Math.random() * letrasMaiusculas.length); // * MATH.FLOOR ARREDONDA PARA BAIXO, ELE PEGA O COMPRIMETO DO ARRAY INDICADO E MUSTIPLICA, ASSIM, NA HORA DE INSERIR A LETRA, PODE SER QUALQUER LETRA DO ARRAY
    const lugarAInserir = Math.floor(Math.random() * token.length); // * O MESMO ACONTECE AQUI, MAS INDICA O ÍNDICE A SER INSERIDO NO TOKEN

    token = inserirNoMeio(
      token,
      lugarAInserir,
      letrasMaiusculas[letraAInserir],
    ); // * POR FIM, O TOKEN SE SOBRESCREVE COM O VALOR NOVO
  }

  for (let i = 0; i < 30; ++i) {
    const letraAInserir = Math.floor(Math.random() * letrasMinusculas.length);
    const lugarAInserir = Math.floor(Math.random() * token.length);

    token = inserirNoMeio(
      token,
      lugarAInserir,
      letrasMinusculas[letraAInserir],
    );
  }

  for (let i = 0; i < 30; ++i) {
    const letraAInserir = Math.floor(
      Math.random() * caracteresEspeciais.length,
    );
    const lugarAInserir = Math.floor(Math.random() * token.length);

    token = inserirNoMeio(
      token,
      lugarAInserir,
      caracteresEspeciais[letraAInserir],
    );
  }

  for (let i = 0; i < 30; ++i) {
    const letraAInserir = Math.floor(Math.random() * numeros.length);
    const lugarAInserir = Math.floor(Math.random() * token.length);

    token = inserirNoMeio(token, lugarAInserir, numeros[letraAInserir]);
  }

  return token; // ! RETORNA O TOKEN PARA A FUNÇÃO AUTENTICAR
}

async function autenticar(email, senha) {
  try {
    // ! LOGA O USUÁRIO NO SITE
    let query = `SELECT idUsuario, nome, email, identidade, timestampdiff(YEAR, dtNascimento, curdate()) as idade, senha, cargo FROM usuario WHERE email = ? AND senha = ?;`; // ! PEGA TODOS OS VALORES DO USUÁRIO

    const result = await bd.executar(query, [email, senha]);

    if (result.length === 0 || result.length > 1) return false; // ! SE NÃO HOUVER RESULTADO DO SELECT OU SE HOUVER MAIS DE UM RESULTADO

    // ! SE HOUVER APENAS 1 RESULTADO (IMPORTANTO PARA USUÁRIOS EVITAR DUPLICADOS)
    query = "select count(fkUsuario) as quizes_completos from quizes_completos where fkUsuario = ?"; // ! SOBRESCREVO A VARIÁVEL, AGORA PARA CONTAR QUANTOS QUIZES O USUÁRIO CONCLUIU

    const result2 = await bd.executar(query, [result[0].idUsuario]);
    if (!result2) return false;

    const token = gerarToken(); // ! GERO O TOKEN DO USUÁRIO

    query = 'insert into token (token, fkUsuario) values (?, ?)'

    const inserirToken = await bd.executar(query, [token, result[0].idUsuario]);
    if (!inserirToken) return false;

    usuariosLogados.push({
      // ? INSIRO TODOS OS DADOS NUM ARRAY, QUE PERMANECERÁ NO BACKEND
      token: token,
      id: result[0].idUsuario,
      nome: result[0].nome,
      email: result[0].email,
      identidade: result[0].identidade,
      idade: result[0].idade,
      senha: result[0].senha,
      cargo: result[0].cargo,
      quizes: result2[0].quizes_completos,
    });

    return token; // ? SE TUDO DER CERTO, RETORNA O TOKEN PARA O FRONT
  } catch (e) {
    console.log(e);
  }
}

function cadastrar(nome, email, identidade, dtNascimento, senha) {
  let query = `
        INSERT INTO usuario (nome, email, identidade, dtNascimento, senha, cargo) VALUES (?, ?, ?, ?, ?, 'p');
    `;
  console.log("Executando a instrução SQL: \n" + query);
  return bd.executar(query, [nome, email, identidade, dtNascimento, senha]);
}

async function informacoes() {
  let query = `
    select 
      case 
        when identidade != 'Masculino' and
        identidade != 'Feminino' and
        identidade != 'Prefiro Não dizer'
        then 'Outros'
        else identidade
        end as identidade, 
    count(identidade) as total 
    from usuario 
    group by identidade`;
  const genero = await bd.executar(query);

  query = `
    select 
        case
            when timestampdiff(year, dtnascimento, curdate()) between 0  and 9  then '0-9'
            when timestampdiff(year, dtnascimento, curdate()) between 10 and 19 then '10-19'
            when timestampdiff(year, dtnascimento, curdate()) between 20 and 29 then '20-29'
            when timestampdiff(year, dtnascimento, curdate()) between 30 and 39 then '30-39'
            when timestampdiff(year, dtnascimento, curdate()) between 40 and 49 then '40-49'
            else '50+'
        end as faixa_etaria,
    count(*) as total
    from usuario
    group by faixa_etaria
    order by faixa_etaria;`;

  const faixaEtaria = await bd.executar(query);

  query = `
    select
        case
            when fkUsuario between 1 and 10 then '1-10'
            when fkUsuario between 11 and 20 then '11-20'
            when fkUsuario between 21 and 30 then '21-30'
            when fkUsuario between 31 and 40 then '31-40'
            when fkUsuario between 41 and 50 then '41-50'
            when fkUsuario between 51 and 60 then '51-60'
            when fkUsuario between 61 and 70 then '61-70'
            when fkUsuario between 71 and 80 then '71-80'
            when fkUsuario between 81 and 90 then '81-90'
            when fkUsuario between 91 and 100 then '91-100'
            else '100+'
        end as total_quizes,
    count(*) as total
    from quizes_completos
    group by total_quizes
    order by total_quizes`

  const quizes = await bd.executar(query);

  return [genero, faixaEtaria, quizes];
}

async function excluir(idUsuario) {
  let update = 'update quiz set fkUsuario = 1 where fkUsuario = ?'
  const quizes = await bd.executar(update, [idUsuario]);

  if (!quizes.ok) return false;

  let query = `delete from usuario where idUsuario = ?`;
  return bd.executar(query, [idUsuario]);
}

async function verificar(token) {
  let query = `select token, 
    case 
      when 
        DATE(dthr) < DATE(now()) OR 
        MONTH(dthr) < MONTH(now()) OR 
        HOUR(dthr) + 12 < HOUR(now()) 
        then 'Expirado' 
        else 'Renovado' 
      end as situacao 
    from token where token = ?`;

  const resultado = await bd.executar(query, [token]);
  if(!resultado) return false;

  console.log(resultado)

  return resultado;
}

function atualizar(token) {
  let query = `update token set dthr = now() where token = ?`;

  return bd.executar(query, [token]);
}

function deslogar(id) {
  let query = `delete from token where fkUsuario = ?`;

  return bd.executar(query, [id]);
}

async function mudar(array, id) {

  for(let i = 0; i < array.length; ++i){
    let campo = array[i].campo;
    let info = array[i].info;
    let query = 'update from usuario set ? = ? where idUsuario = ?'

    const mudar = await bd.executar(query, [campo, info, id])
  }

}

module.exports = {
  autenticar,
  cadastrar,
  informacoes,
  usuariosLogados,
  excluir,
  verificar,
  atualizar,
  deslogar,
  mudar
};
