const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");
const array = require("../models/usuarioModel");


async function verificarToken(req, res) { // ! FUNÇÃO PADRÃO PARA VERIFICAR O TOKEN DO USUÁRIO! PEGA O REQ E RES DA REQUISIÇÃO PAI E BUSCA PELO TOKEN, E PELO USUÁRIO, RETORNA UM ARRAY COM O RESULTADO DA BUSCA (TRUE || FALSE) E O USUÁRIO;
  const token = req.headers["token"]; // ? PEGA O TOKEN PELA HEADER DA REQUISIÇÃO

  if (!token) { // ? SE NÃO HOUVER TOKEN RETORNA FALSE
    return false;
  }
  
  const user = await usuarioController.verificar(req, res, token); // ? SE HOUVER, RETORNA O ARRAY, COM O RESULTADO DA BUSCA E O USUÁRIO
  if(!user) return false;

  return user
}

router.post("/cadastrar", (req, res) => {
  usuarioController.cadastrar(req, res);
});

router.post("/autenticar", (req, res) => {
  usuarioController.autenticar(req, res);
});

router.get("/informacoes", async (req, res) => { // ! FUNÇÃO ASYNC PARA ESPERAR O VERIFICAR TOKEN
  // ? PRECISA DE TOKEN
  const verificar = await verificarToken(req, res); // ? ENVIA O CORPO DA REQUISIÇÃO A FUNÇÃO
  if(!verificar) return res.status(400).send(false); // ? SE O TOKEN NÃO FOR VÁLIDO

  const cargo = verificar.cargo;
  if(cargo != 'a') return res.status(400).send('Sem permissões');

  usuarioController.informacoes(req, res);
});

router.get("/verificar", async (req, res) => {
  // ? PRECISA DE TOKEN
  const verificar = await verificarToken(req, res);
  if (!verificar) return res.status(400).send(false);

  const cargo = verificar.cargo;
  const nome = verificar.nome;
  
  res.status(200).send({cargo, nome});
});

router.get("/deslogar", async (req, res) => {
  // ? PRECISA DE TOKEN
  const verificar = await verificarToken(req, res);
  if(!verificar) return res.status(400).send(false);
  
  usuarioController.deslogar(req, res, verificar.id); 
});

router.get('/excluir', async (req, res) => {
  // ? PRECISA DE TOKEN
  const verificar = await verificarToken(req, res);
    if(!verificar) return res.status(400).send(false);

  usuarioController.excluir(req, res, verificar.id);
});

router.get("/dados", async (req, res) => {
  // ? PRECISA DE TOKEN
  const verificar = await verificarToken(req, res);
    if(!verificar) return res.status(400).send(false);

  res.status(200).send({
    nome: verificar.nome,
    email: verificar.email,
    identidade: verificar.identidade,
    idade: verificar.idade,
    senha: verificar.senha,
    quizes: verificar.quizes,
    dtNascimento: verificar.dtNascimento
  }); // ? SE OCORRER TUDO, RETORNA O JSON USUÁRIO PARA O FRONT
});

router.post('/mudar', async (req, res) => {
  // ? PRECISA DE TOKEN
  const verificar = await verificarToken(req, res);
    if(!verificar) return res.status(400).send(false);

  usuarioController.mudar(req, res, verificar.id);
});

module.exports = router;
