const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 3000;
const { parseISO, addDays, getDay, isSaturday, isSunday } = require("date-fns");
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
    const result = await pool.query("SELECT * FROM jogador");
    res.json(result.rows); // no pg, os dados vêm em result.rows
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar jogadores", mensagem: err } );
  }
});


// detalhar 1
app.get("/jogadores/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // consulta o banco
    const result = await pool.query("SELECT * FROM jogador WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Jogador não encontrado" });
    }

    res.status(200).json(result.rows[0]); // retorna o jogador encontrado
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar jogador no banco" });
  }
});


// criar
app.post("/jogadores", async (req, res) => {
  const { nome, posicao } = req.body;

  if (!nome || !posicao) {
    return res.status(400).json({ erro: "Nome e posição são obrigatórios" });
  }

  try {
    await pool.query(
      "INSERT INTO jogador (nome, posicao) VALUES ($1, $2)",
      [nome, posicao]
    );
    res.status(201).json({ mensagem: "Jogador criado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar jogador no banco" });
  }
});

// excluir
app.delete("/jogadores/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    const result = await pool.query("DELETE FROM jogador WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: "Jogador não encontrado" });
    }

    res.status(200).json({ mensagem: "Jogador excluído com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao excluir jogador no banco" });
  }
});

// Endpoint para adicionar dias úteis a uma data
app.post("/adicionar-dias-uteis", (req, res) => {
  const { dataInicio, diasParaAdicionar } = req.body;

  // Validação básica dos dados
  if (!dataInicio || diasParaAdicionar === undefined) {
    return res.status(400).json({
      error: 'Os campos "dataInicio" e "diasParaAdicionar" são obrigatórios.',
    });
  }

  // Parse da data de início
  let dataAtual = parseISO(dataInicio);
  let diasAdicionados = 0;

  // Loop para adicionar os dias, ignorando sábados e domingos
  while (diasAdicionados < diasParaAdicionar) {
    dataAtual = addDays(dataAtual, 1);

    // Verifica se o dia atual não é sábado (6) ou domingo (0)
    if (!isSaturday(dataAtual) && !isSunday(dataAtual)) {
      diasAdicionados++;
    }
  }

  // Formatação para um formato de data padrão (YYYY-MM-DD)
  const dataFinal = dataAtual.toISOString().split("T")[0];

  // Resposta do endpoint com a nova data
  res.json({
    dataInicio: dataInicio,
    diasAdicionados: diasParaAdicionar,
    dataFinal: dataFinal,
  });
});
//licao de casa
app.get("/dia-da-semana/:data", (req, res) => {
  const { data } = req.params;

  try {
    // Função declarada dentro da rota
    const getDayOfWeek = (dateString) => {
      const date = new Date(dateString);
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[date.getUTCDay()];
    };

    const diaDaSemana = getDayOfWeek(data);

    if (!diaDaSemana) {
      return res
        .status(400)
        .json({ error: "Data inválida. Use formato YYYY-MM-DD" });
    }

    res.json({ diaDaSemana });
    //
  } catch (err) {
    res.status(400).json({ error: "Erro ao processar a data." });
  }
});
// start
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
// comentario do Marcio para o Eduardo avaliar
// comentario dois
