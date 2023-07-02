import axios from 'axios'

// axios.post('http://localhost:5000/participants',{name: "<L>Thais  "}).then(res => {
//     console.log(res.data)
// }).catch(err => {
//     console.log(err)
// })

const headers = {
    User: 'sad'
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

const messageId = '649f52bda9f12cfa367ed44e'

axios.delete(`http://localhost:5000/messages/${messageId}`,{ headers })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });