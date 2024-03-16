const express = require('express');
const fs = require('fs');
const path = require('path');
const formidable = require('express-formidable');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(formidable());

app.post('/upload', (req, res) => {
  const uploadedFile = req.files['image'];

  if (!uploadedFile) {
    return res.status(400).json({ error: 'Nenhum arquivo recebido.' });
  }

  const tempPath = uploadedFile.path;
  const targetPath = path.join(__dirname, 'images', 'temp.png');

  fs.rename(tempPath, targetPath, (err) => {
    if (err) {
      console.error('Erro ao salvar a imagem:', err);
      return res.status(500).json({ error: 'Erro ao salvar a imagem.' });
    }
    console.log('Imagem salva com sucesso.');
    res.status(200).json({ message: 'Imagem enviada com sucesso e salva como temp.png' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
