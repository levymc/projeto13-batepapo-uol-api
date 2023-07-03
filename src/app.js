import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import { arrayCadastro } from './varDec.js';    
import dayjs from 'dayjs'
import { schemaName, schemaMessage, schemaLimit } from './schemasJoi.js';
import { stripHtml } from "string-strip-html";
import path from 'path'

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
const frontPath = path.join(process.cwd(), 'front/front-bate-papo-uol');
app.use(express.static(frontPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontPath, 'index.html'));
  });

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
    let { name } = req.body;
    const { error } = schemaName.validate({ name });
    
    if (error) {
        console.log(error)
        return res.sendStatus(422)
    } else {
        name = (stripHtml(name).result).trim()
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
    let { to, text, type } = req.body
    let from = req.headers.user
    

    console.log(to, text, type, from)

    const participant = await db.collection("participants").findOne({ name: { $eq: from } })
    const { error } = schemaMessage.validate({ to, text, type, from });
    if (error || !participant){
        return res.status(422).send("Erro 422 na rota post /messages")
    }else{
        to = (stripHtml(to).result).trim()
        text = (stripHtml(text).result).trim()
        type = (stripHtml(type).result).trim()
        from = (stripHtml(from).result).trim()
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
    const user = Buffer.from(req.headers.user, 'latin1').toString('latin1')
    // console.log(2, user)

    let { limit } = req.query
    limit = parseInt(limit)
    const { error } = schemaLimit.validate({ limit })

    const messages = await db.collection("messages").find({
        $or: [
            { to:  user},
            { to: "Todos"},
            { from: user },
            { type: "message" }
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
    const now = Date.now()
    const user = Buffer.from(req.headers.user, 'latin1').toString('latin1')
    
    try{
        const participant = await db.collection("participants").findOne({ name: user })
        console.log("Auii",participant)
    
        if ( !user || !participant ){
            return res.sendStatus(404)
        }else{
            await db.collection("participants").updateOne({_id: new ObjectId(participant._id)}, { $set: {lastStatus: now}})
            return res.sendStatus(200)
        }
    }catch(err){
        console.error("Erro: ", err.message)
        return res.status(500).send(err.message)
    }
})


app.delete('/messages/:messageId', async (req, res) => {
    const messageId = req.params.messageId;
    const user = Buffer.from(req.headers.user, 'latin1').toString('latin1')

    try{
        const message = await db.collection("messages").findOne({  _id: {$eq: new ObjectId(messageId)} })
        console.log(333, message)

        const messagesDeleted = await db.collection("messages").deleteOne(
            { _id: {$eq: new ObjectId(messageId)}},
        )
        if( message.from != user ){
            res.sendStatus(401)
        }else if (messagesDeleted.deletedCount === 0 || !message){
            res.sendStatus(404)
        }
        res.send(`Mensagem de ID ${messageId} foi deletada com sucesso.`);

    }catch(err){
        res.sendStatus(404)
    }
})


app.put('/messages/:messageId', async (req, res) => {
    const messageId = req.params.messageId;
    let from = req.headers.user
    let { to, text, type } = req.body
    const { error } = schemaMessage.validate({ to, text, type, from });
    console.log(to, text, type, from)

    if (error) {
        return res.sendStatus(422)
    }
    try{
        to = (stripHtml(to).result).trim()
        text = (stripHtml(text).result).trim()
        type = (stripHtml(type).result).trim()
        from = (stripHtml(from).result).trim()
        console.log(messageId)
        const message = await db.collection("messages").findOne({  _id: {$eq: new ObjectId(messageId)} })
        if(!message){
            res.sendStatus(404)
        }else if( message.from != from ){
            res.sendStatus(401)
        }
        await db.collection("messages").updateOne(
            { _id: {$eq: new ObjectId(messageId)}},
            {$set: {from: from, to: to, text: text, type: type, time: dayjs().format('HH:mm:s')}}
        )
        res.send(`Mensagem de ID ${messageId} foi atualizada com sucesso!!!`);

    }catch(err){
        res.status(401).send(err.message.de)
    }
})


setInterval(async () => {
    console.log("Rodou")
    try{
        const participants = await db.collection("participants").find({lastStatus:{ $lte: Date.now() - 10000 }}).toArray()
        if(participants){
            participants.forEach(async element => {
                await db.collection("messages").insertOne({
                    from: element.name,
                    to: 'Todos',
                    text: 'sai da sala...',
                    type: 'status',
                    time: dayjs().format('HH:mm:s')
                })
                await db.collection("participants").deleteOne({ _id: new ObjectId(element._id) })
                console.log(`${element.name} foi removído da sessão!`)
            });
        }
    }catch(err){
        console.error(err.message)
    }
}, 10000)

run()    
// export default mongoClient;
