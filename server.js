const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); // para ler JSON do body

// lista em memória
let players = [
  { id: 1, nome: "Weverton", posicao: "Atacante" },
  { id: 2, nome: "Gómez", posicao: "Zagueiro" },
  { id: 3, nome: "Evangelista", posicao: "Volante" },
  { id: 4, nome: "Flaco", posicao: "Atacante" },
];

// rota raiz
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// listar todos
app.get("/jogadores", (req, res) => {
  res.json(players);
});

// detalhar 1
app.get("/jogadores/:id", (req, res) => {
  const player = players.find(p => p.id === parseInt(req.params.id));
  if (!player) {
    return res.status(404).json({ erro: "Jogador não encontrado" });
  }
  res.json(player);
});

// criar
app.post("/jogadores", (req, res) => {
  const novo = {
    id: req.body.id || players.length + 1, // gera ID automático
    nome: req.body.nome,
    posicao: req.body.posicao
  };
  players.push(novo);
  res.status(201).json(novo);
});

// excluir
app.delete("/jogadores/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const existe = players.some(p => p.id === id);
  if (!existe) {
    return res.status(404).json({ erro: "Jogador não encontrado" });
  }
  players = players.filter(p => p.id !== id);
  res.json({ mensagem: "Jogador removido com sucesso" });
});

// start
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
