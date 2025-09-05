const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const pool = require('./db');

const app = express();
const port = 3000;

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/cadastro', async (req, res) => {
  const { nome, convenio, telefone } = req.body;
  
  if (!nome || !convenio || !telefone) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO credenciais_wifi (nome_paciente, convenio, telefone) VALUES ($1, $2, $3) RETURNING *',
      [nome, convenio, telefone]
    );
    
    res.status(201).json({
      message: 'Cadastro realizado com sucesso!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Erro ao inserir no banco:', err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});