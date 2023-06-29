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
    await mongoClient.connect()
    console.log('Conexão!!!')
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
  
    if (error) {
        return res.sendStatus(422)
    } else {
        try{
            const participant = await db.collection("participants").findOne({ name: name })
            if (!participant) {
                const message = { 
                    from: name,
                    to: 'Todos',
                    text: 'entra na sala...',
                    type: 'status',
                    time: dayjs().format('HH:mm:s')
                }
                await db.collection("participants").insertOne({ name: name, lastStatus: Date.now() })
                await db.collection("messages").insertOne(message)
                res.sendStatus(201)
                
            } else {
                console.log('Erro 409 - já cadastrado!');
                return res.status(409).send("Já cadastrado!")
            }
        }catch(err){
            res.status(500).send(err.message)
        }
    }
});


app.get('/participants', async (req, res) => {
    const participantsList = await db.collection("participants").find().toArray()
    return res.send(participantsList)
});


app.post('/messages', async (req, res) => {
    const { to, text, type } = req.body
    const from = req.headers.user

    const participant = await db.collection("participants").findOne({ name: { $eq: from } })
    const { error } = schemaMessage.validate({ to, text, type, from });
    if (error || !participant){
        return res.status(422).send("Erro 422 na rota post /messages")
    }else{
        const message = {
            from,
            to,
            text,
            type,
            time: dayjs().format('HH:mm:s')
        };  
        try{
            await db.collection("messages").insertOne(message)
            console.log("Mensagem: ", message)
            return res.status(201).send(`${message}`)
        }
        catch(err){
            console.log(err.message)
            return res.status(409).send("Ocorreu algum erro no Banco.")
        }
    }
})


app.get('/messages', async (req, res) => {
    const { user } = req.headers

    let { limit } = req.query
    limit = parseInt(limit)
    const { error } = schemaLimit.validate({ limit })

    const messages = await db.collection("messages").find({
        $or: [
            { to:  user},
            { to: "Todos"},
            { from: user }
        ]
    }).toArray()


    if( error || !messages ){
        return res.sendStatus(422)
    }else{
        if (limit){
            res.status(200).send(messages.slice(messages.length - limit, messages.length))
        }else{
            res.status(200).send(messages)
        }
    }
})


app.post('/status', async (req, res) => {
    const user = req.headers.user
    try{
        const participant = await db.collection("participants").findOne({ name: user })
        console.log("Auii",participant)
    
        if ( !user || !participant ){
            return res.sendStatus(404)
        }else{
            await db.collection("participant").updateOne({_id: participant._id}, { $set: {lastStatus: Date.now()}})
            console.log("2222",participant)
            return res.sendStatus(200)
        }
    }catch(err){
        console.error("Erro: ", err.message)
        return res.status(500).send(err.message)
    }
    
})

  


// console.log(process.env.PORT, process.env.DATABASE_URL)

run()    
export default mongoClient;
