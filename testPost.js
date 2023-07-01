import axios from 'axios'

axios.post('http://localhost:5000/participants',{name: "<L>Thais  "}).then(res => {
    console.log(res.data)
}).catch(err => {
    console.log(err)
})

const headers = {
    User: 'Thais'
};

// axios.post('http://localhost:5000/messages',{
//     to: 'Levy',
//     text: 'oi rs',
//     type: 'private_message'
//   }, { headers }).then(res => {
//     console.log(res.data)
// }).catch(err => {
//     console.log(err)
// })

// axios.post('http://localhost:5000/status', {} ,{ headers }).then(res => {
//         console.log(res.data)
//     }).catch(err => {
//         console.log(err)
//     })
