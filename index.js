// express 모듈을 가져온다
const express = require('express')
// express function을 통해서 app을 만든다
const app = express()
// listen port 설정
const port = 5000
const bodyParser = require('body-parser');

// 실행 모드에 따라 다른 key 값을 가져올 수 있게 key.js에 미리 설정
const config = require('./config/key');

// 기존에 만들 models의 User.js를 가져온다
const { User } = require("./models/User");

// application/x-www-form-urlencoded 타입으로 오는 데이터를 분석할 수 있도록 옵션 추가
app.use(bodyParser.urlencoded({extended: true}));
// application/json 타입으로 오는 데이터를 분석할 수 있도록 옵션 추가
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {

  // 회원가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body)

  user.save((err, doc) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})