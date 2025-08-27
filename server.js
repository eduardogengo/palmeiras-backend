const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 3000;

// cors habilitado pra todos
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json()); // para ler JSON do body
// teste do primeiro commit
//  alteração do commit do EDU
// rota raiz
app.get("/", (req, res) => {
  res.status(200).send("Servidor rodando!");
});

// listar todos
app.get("/jogadores", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM jogador");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar jogadores" });
  }
});

// detalhar 1
app.get("/jogadores/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // consulta o banco
    const [rows] = await pool.query("SELECT * FROM jogador WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Jogador não encontrado" });
    }

    res.status(200).json(rows[0]); // retorna o jogador encontrado
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar jogador no banco" });
  }
});

// criar
app.post("/jogadores", (req, res) => {
  if (!req.body.nome || !req.body.posicao) {
    return res.status(400).json({ erro: "Nome e posição são obrigatórios" });
  }
  // insert no banco
  const novoJogador = {
    nome: req.body.nome,
    posicao: req.body.posicao,
  };
  pool
    .query("INSERT INTO jogador SET ?", novoJogador)
    .then(() => {
      res.status(201).json({ mensagem: "Jogador criado com sucesso" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ erro: "Erro ao criar jogador no banco" });
    });
});

// excluir
app.delete("/jogadores/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  // delete no banco
  pool
    .query("DELETE FROM jogador WHERE id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: "Jogador não encontrado" });
      }
      res.status(200).json({ mensagem: "Jogador excluído com sucesso" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ erro: "Erro ao excluir jogador no banco" });
    });
});

// start
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
