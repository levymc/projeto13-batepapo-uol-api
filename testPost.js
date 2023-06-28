import axios from 'axios'

axios.post('http://localhost:5000/participants',{name: "levy"}).then(res => {
    console.log(res.data)
}).catch(err => {
    console.log(err)
})

const headers = {
    User: 'João'
};

// axios.post('http://localhost:5000/messages',{
//     to: 'Maria',
//     text: 'oi sumida rs',
//     type: 'private_message'
//   }, { headers }).then(res => {
//     console.log(res.data)
// }).catch(err => {
//     console.log(err)
// })



