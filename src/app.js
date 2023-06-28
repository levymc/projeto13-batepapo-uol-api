import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import { arrayCadastro } from './varDec.js';
import dayjs from 'dayjs'
import { schemaName, schemaMessage, schemaLimit } from './schemasJoi.js';


dotenv.config();
const app = express();

console.log(process.env.PORT)
app.use(cors());
app.use(express.json());


const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db ;

const run = async () => {
  try {
    await mongoClient.connect().then(() => {
        console.log('Conexão!!!')
    })
    app.listen(process.env.PORT, () => {
        console.log(`Servidor Express rodando na url: http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error('Erro ao conectar no banco:', err)
  }
  db =  mongoClient.db()
};


app.post('/participants', async (req, res) => {
    const { name } = req.body;
  
    const { error } = schemaName.validate({ name });
  
    console.log(arrayCadastro, "Cadastro");
  
    if (error) {
        return res.status(422).json({ error: error.details[0].message });
    } else {
        const participant = await db.collection("participants").findOne({ name: { $eq: name } })
        
        if (!participant) {
            console.log("oi")
            // arrayCadastro.push({
                // name: name,
                // lastStatus: Date.now()
            // });
            db.collection("participants").insertOne({
                name: name,
                lastStatus: Date.now()
            });
            return res.sendStatus(201);
        } else {
            console.log('Erro 409 - já cadastrado!');
            return res.status(409).send("Já cadastrado!")
        }
    }
  });

app.get('/participants', async (req, res) => {
    const participantsList = await db.collection("participants").find().toArray()
    // console.log(participantsList)
    return res.send(participantsList)
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
        return res.status(201).send(`${message}`)
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

  


// console.log(process.env.PORT, process.env.DATABASE_URL)

run()    
export default mongoClient;
