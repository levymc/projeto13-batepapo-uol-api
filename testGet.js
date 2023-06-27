import axios from 'axios'


axios.get('http://localhost:5000/participants').then(res => {
    console.log(res.data)
}).catch(err => {
    console.log(err)
})
