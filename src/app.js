import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import Joi from 'joi';
import { arrayCadastro } from './varDec.js';

dotenv.config();
const app = express();

// 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

app.use(cors());
app.use(express.json());

const schema = Joi.object({
    name: Joi.string().min(1).required()
});

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'FirstDB';

const mongoClient = new MongoClient(url, { useUnifiedTopology: false });

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



app.post('/participants', (req, res) => {
    const { name } = req.body;
  
    const { error } = schema.validate({ name });

    if (error) {
        return res.status(422).json({ error: error.details[0].message });
    }else{
        if (!arrayCadastro.find(element => element.name === name)){
            arrayCadastro.push({
                name: name,
                lastStatus: Date.now()
            })
            console.log(arrayCadastro)
            return res.sendStatus(201)
        }else{
            console.log('Erro 409')
            return res.sendStatus(409)
        }
    }
});

app.get('/participants', (req, res) => {
    console.log(arrayCadastro)
    return res.send(arrayCadastro)
});

  
app.listen(process.env.PORT, () => {
    console.log(`Servidor Express rodando na url: http://localhost:${process.env.PORT}`);
});


export default mongoClient;
