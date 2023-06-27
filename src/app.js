import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import { arrayCadastro } from './varDec.js';
import dayjs from 'dayjs'
import { schemaName, schemaMessage, schemaLimit } from './schemasJoi.js';



dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


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
        return res.status(201).send(message)
    }
})

app.get('/messages', (req, res) => {
    const { user } = req.headers

    let { limit } = req.query
    limit = parseInt(limit)
    const { error } = schemaLimit.validate({ limit })

    if(error){
        return res.status(422).json({ error: error.details[0].message });
    }else{
        if (limit){
            res.status(201).send(`Limite: ${limit}, User: ${user}`)
        }else{
            res.status(201).send("ALL")
        }
    }
})


app.post('/status', (req, res) => {
    const { User } = req.headers
    if ( !User || !arrayCadastro.find(element => element.name === User) ){
        return res.sendStatus(404)
    }else{
        const infoUser = arrayCadastro.find(element => element.name === User);
        if (infoUser) {
            infoUser.lastStatus = Date.now();
        }
        return res.sendStatus(200)
    }
})

  
app.listen(process.env.PORT, () => {
    console.log(`Servidor Express rodando na url: http://localhost:${process.env.PORT}`);
});


// export default mongoClient;
