const express = require('express');
const app = express();
const sql = require('./db');
const PORT = 3000;
const { parseISO, addDays, isSaturday, isSunday } = require('date-fns');

// cors habilitado pra todos
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json());

// rota raiz
app.get('/', (req, res) => {
  res.status(200).send('Servidor rodando!');
});

// listar todos
app.get('/jogadores', async (req, res) => {
  try {
    const rows = await sql`
    SELECT 
      jogador.id, 
      jogador.nome, 
      posicao.descricao as posicao
    FROM jogador
      JOIN posicao 
        ON jogador.id_posicao = posicao.id;
`;
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar jogadores' });
  }
});
// listar todo
app.get('/posicao', async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM posicao`;
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar jogadores' });
  }
});

// detalhar 1
app.get('/jogadores/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

  try {
    const [row] = await sql`SELECT * FROM jogador WHERE id = ${id}`;
    if (!row) return res.status(404).json({ erro: 'Jogador não encontrado' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar jogador' });
  }
});

// criar
app.post('/jogadores', async (req, res) => {
  const { nome, idPosicao } = req.body;
  if (!nome || !idPosicao)
    return res.status(400).json({ erro: 'Nome e idPosição são obrigatórios' });

  try {
    await sql`INSERT INTO jogador (nome, id_posicao) VALUES (${nome}, ${idPosicao})`;
    res.status(201).json({ mensagem: 'Jogador criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar jogador' });
  }
});

// excluir
app.delete('/jogadores/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

  try {
    const result = await sql`DELETE FROM jogador WHERE id = ${id} RETURNING *`;
    if (result.length === 0)
      return res.status(404).json({ erro: 'Jogador não encontrado' });
    res.json({ mensagem: 'Jogador excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao excluir jogador' });
  }
});

// Endpoint para adicionar dias úteis a uma data
app.post('/adicionar-dias-uteis', (req, res) => {
  const { dataInicio, diasParaAdicionar } = req.body;

  if (!dataInicio || diasParaAdicionar === undefined)
    return res.status(400).json({
      error: 'Os campos "dataInicio" e "diasParaAdicionar" são obrigatórios.',
    });

  let dataAtual = parseISO(dataInicio);
  let diasAdicionados = 0;

  while (diasAdicionados < diasParaAdicionar) {
    dataAtual = addDays(dataAtual, 1);
    if (!isSaturday(dataAtual) && !isSunday(dataAtual)) diasAdicionados++;
  }

  const dataFinal = dataAtual.toISOString().split('T')[0];
  res.json({
    dataInicio,
    diasAdicionados: diasParaAdicionar,
    dataFinal,
  });
});

// Lição de casa
app.get('/dia-da-semana/:data', (req, res) => {
  const { data } = req.params;
  try {
    const diaDaSemana = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ][new Date(data).getUTCDay()];
    if (!diaDaSemana)
      return res
        .status(400)
        .json({ error: 'Data inválida. Use formato YYYY-MM-DD' });
    res.json({ diaDaSemana });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao processar a data.' });
  }
});

// teste de conexão com o banco
app.get('/teste-conexao-db', async (req, res) => {
  try {
    const [row] = await sql`SELECT NOW()`;
    res.json({ message: 'Conexão bem-sucedida!', time: row.now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// start
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
