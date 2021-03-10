// express 모듈을 가져온다
const express = require('express')
// express function을 통해서 app을 만든다
const app = express()
// listen port 설정
const port = 5000


const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://test:FtoOyAYEtD8JOD7p@getinhere.dr22w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!~~')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})