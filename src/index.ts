import express from 'express';
import fs from 'fs';
import path from 'path';
import formidable from 'express-formidable';
import cors from 'cors'

const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));

app.use(formidable()); 

app.use(cors());

app.get('/', (_, res) => {
  console.log('Olá!')
  return res.status(200)
})

app.post('/upload', (req: any, res: any) => {
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
