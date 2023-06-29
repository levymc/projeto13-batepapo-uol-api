import { strict as assert } from "assert";

import { stripHtml } from "string-strip-html";

// import { MongoClient } from "mongodb";

// const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/local");
// let db;

// mongoClient.connect()
//  .then((res) => {
//     db = mongoClient.db()
//     console.log(res, "conexão!!")
// })
//  .catch((err) => console.log(err.message));

// console.log( Date.now() )
// setInterval(()=>{console.log("oi")}, 10000)
const someHtml = `<code>#include <stdio.h>;</code> and <code>#include &lt;stdio.h&gt;</code>`;

const mensagemFiltrada = stripHtml(someHtml).result

console.log(mensagemFiltrada)