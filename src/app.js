import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'FirstDB';

const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

const run = async () => {
  try {
    await mongoClient.connect();
    console.log('Conexão com o MongoDB estabelecida com sucesso');
    app.listen(process.env.PORT, () => {
      console.log(`Servidor Express rodando na porta ${process.env.PORT}`);
    });
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
  }
};

run();

export default mongoClient;
