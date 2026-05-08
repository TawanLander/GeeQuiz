const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");
const array = require("../models/usuarioModel");


function verificarToken(req, res) { // ! FUNÇÃO PADRÃO PARA VERIFICAR O TOKEN DO USUÁRIO! PEGA O REQ E RES DA REQUISIÇÃO PAI E BUSCA PELO TOKEN, E PELO USUÁRIO, RETORNA UM ARRAY COM O RESULTADO DA BUSCA (TRUE || FALSE) E O USUÁRIO;
  const token = req.headers["token"]; // ? PEGA O TOKEN PELA HEADER DA REQUISIÇÃO
  const user = array.usuariosLogados.find((user) => user.token === token); // ? ACHA O USUÁRIO COM ESSE TOKEN

  if (!token || !user) { // ? SE NÃO HOUVER TOKEN OU USUÁRIO RETORNA FALSE
    return false;
  }
  
  return [usuarioController.verificar(req, res, token), user]; // ? SE HOUVER, RETORNA O ARRAY, COM O RESULTADO DA BUSCA E O USUÁRIO
}

router.post("/cadastrar", (req, res) => {
  usuarioController.cadastrar(req, res);
});

router.post("/autenticar", (req, res) => {
  usuarioController.autenticar(req, res);
});

router.get("/informacoes", async (req, res) => { // ! FUNÇÃO ASYNC PARA ESPERAR O VERIFICAR TOKEN
  // ? PRECISA DE TOKEN
  const verificar = verificarToken(req, res); // ? ENVIA O CORPO DA REQUISIÇÃO A FUNÇÃO
  if(!verificar) return res.status(400).send(false); // ? VÊ SE TEM USUÁRIO ATIVO COM O TOKEN

  const resultado = await verificar[0]; // ? SE TIVER DA BUSCA O TOKEN
  if(!resultado) return res.status(400).send(false); // ? SE NÃO HOUVER TOKEN ATIVO (CASO O TOKEN EXPIROU), RETORNA FALSE

  const cargo = verificar[1].cargo; // ? TUDO OCORREU BEM, PEGA O CARGO DO USUÁRIO
  if(cargo != 'a') return res.status(400).send('Sem permissões');

  usuarioController.informacoes(req, res);
});

router.get("/verificar", async (req, res) => {
  // ? PRECISA DE TOKEN
  const verificar = verificarToken(req, res);
  if (!verificar) return res.status(400).send(false);

  const resultado = await verificar[0];
  if (!resultado) return res.status(400).send(false)

  const cargo = verificar[1].cargo;

  res.status(200).send(cargo);
});

router.get("/deslogar", async (req, res) => {
  // ? PRECISA DE TOKEN
  const verificar = verificarToken(req, res);
  if(!verificar) return res.status(400).send(false);

  const resultado = await verificar[0];
  if(!resultado) return res.status(400).send(false);
  
  const user = verificar[1];
  let index = array.usuariosLogados.indexOf(user);
  array.usuariosLogados.splice(index, 1);

  usuarioController.deslogar(req, res, user.id); 
});

router.get('/excluir', async (req, res) => {
  // ? PRECISA DE TOKEN
  const verificar = verificarToken(req, res);
    if(!verificar) return res.status(400).send(false);

  const resultado = await verificar[0];
  if(!resultado) return res.status(400).send(false);

  usuarioController.excluir(req, res, verificar[1].id);
});

router.get("/dados", async (req, res) => {
  // ? PRECISA DE TOKEN
  const verificar = verificarToken(req, res);
    if(!verificar) return res.status(400).send(false);

  const resultado = await verificar[0];
  if(!resultado) return res.status(400).send(false);

  const user = verificar[1];
  res.status(200).send({
    nome: user.nome,
    email: user.email,
    identidade: user.identidade,
    idade: user.idade,
    senha: user.senha,
    quizes: user.quizes
  }); // ? SE OCORRER TUDO, RETORNA O JSON USUÁRIO PARA O FRONT
});

router.post('/mudar', async (req, res) => {
  // ? PRECISA DE TOKEN
  const verificar = verificarToken(req, res);
    if(!verificar) return res.status(400).send(false);

  const resultado = await verificar[0];
  if(!resultado) return res.status(400).send(false);

  usuarioController.mudar(req, res);
});

module.exports = router;
