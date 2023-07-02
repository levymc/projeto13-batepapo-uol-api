import axios from 'axios'

// axios.post('http://localhost:5000/participants',{name: "asda"}).then(res => {
//     console.log(res.data)
// }).catch(err => {
//     console.log(err)
// })

const headers = {
    User: 'asda'
};

// axios.post('http://localhost:5000/messages',{
//     to: 'Levy',
//     text: 'oi raaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
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

const messageId = '64a0e0dff264dc8d3a9464fd'

// axios.delete(`http://localhost:5000/messages/${messageId}`,{ headers })
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.error(error);
//   });

axios.put(`http://localhost:5000/messages/${messageId}`,{
        to: 'Levy',
        text: 'test rs',
        type: 'private_message'
      },{ headers })