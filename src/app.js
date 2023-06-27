import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import Joi from 'joi';
import { arrayCadastro } from './varDec.js';
import dayjs from 'dayjs'


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const schemaName = Joi.object().keys({
    name: Joi.string().min(1).required(),
});
const schemaMessage = Joi.object().keys({
    to: Joi.string().min(1).required(),
    text: Joi.string().min(1).required(),
    type: Joi.string().valid('message', 'private_message').required(),
    from: Joi.string().required().valid(...arrayCadastro.map(participant => participant.name))
});
  

// const mongoClient = new MongoClient(process.env.DATABASE_URL, { useUnifiedTopology: false });

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
  
    const { error } = schemaName.validate({ name });

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


app.post('/messages', (req, res) => {
    const { to, text, type } = req.body
    const from = req.headers.user;

    const { error } = schemaMessage.validate({ to, text, type, from });

    if (error){
        return res.status(422).json({ error: error.details[0].message });
    }else{
        const message = {
            from,
            to,
            text,
            type,
            time: dayjs().format('HH:mm:s')
        };  
        console.log("Mensagem: ", message)
        return res.status(200).send(message)
    }
})



  
app.listen(process.env.PORT, () => {
    console.log(`Servidor Express rodando na url: http://localhost:${process.env.PORT}`);
});


// export default mongoClient;
