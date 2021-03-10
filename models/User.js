const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    }, 
    email: {
        type: String,
        trim: true,
        unique: 1
    },  
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// User 모델에 대해서 save를 수행하려고 할 때
// save 이전에 수행할 함수를 정의
userSchema.pre('save', function( next ){
    var user = this;
    // user의 비밀번호가 수정되었을 때만
    if(user.isModified('password')) {
        // 비밀번호를 암호화 시킨다
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash
                next();
            });
        });
    } else {
        next();
    }
});

// comparePassword 부분은 바꿔도 되지만
// USER 객체에서 사용할 때도 동일한 이름으로 호출해야 함
userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword 1234567     암호화된 비밀번호 $2b$10$fZxGpASEsI04md0XLwUTwe72KFlloLdNm/VSzEGay3iFoDtfN23me
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
            cb(null, isMatch);
    });
};


userSchema.methods.generateToken = function(cb) {

    var user = this;
    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    // user._id + 'secretToken' = token;
    // ->
    // 'secretToken' -> user._id

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user)
    });
};

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function (err, user){
            if (err) return cb(err);
            cb(null, user);
        });
    });

}

const User = mongoose.model('User', userSchema)

// user라는 모델을 외부에서도 사용할 수 있게 설정 
module.exports = { User }