import axios from 'axios'

axios.post('http://localhost:5000/participants',{name: "levy"}).then(res => {
    console.log(res.data)
}).catch(err => {
    console.log(err)
})