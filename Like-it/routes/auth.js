var express = require('express');
const router = express.Router();
const sha = require('sha256');
const db = require('../lib/db.js'); 
const upload = require('../lib/Multer.js');
module.exports = (app) => {

    // const bodyParser = require('body-parser');
    // app.use(bodyParser.urlencoded({
    //     extended: false
    // }));
    // app.use(bodyParser.json());

    const passport = require('../lib/passport.js')(app); //passport 사용
  
    router.get('/register',(req,res)=>{
        console.log(app.mount);
        res.render('auth', {register:true});

    })
    router.get('/',(req,res)=>{
        console.log(req.url);
        res.render('auth', {register:false});

    })
    router.post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login'
        })
    );
    router.post('/register',upload.single('file'), function (request, response) { //name= {id , password , nickname} 으로 받음 
        const post = request.body;
        // var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!@#$%^&*()";
        // var string_length = 15;
        var salt = '1';
        const file=`images/${request.file.originalname}`;
        console.log("file",request.file);
        console.log("dir",file);
        db.query('SELECT id FROM auth_local WHERE id=?', post.id, function (err, result) {
            if (result[0]) {
                
                return response.status(400).json({
                    SERVER_RESPONSE: 0,
                    SERVER_MESSAGE: "Existed ID"
                }) // 이미 존재하는 아이디이면 다시 팅김
            } else {
                // for (var i = 0; i < string_length; i++) {
                //     var rnum = Math.floor(Math.random() * chars.length);
                //     salt += chars.substring(rnum, rnum + 1);
                // }
                db.query("INSERT INTO auth_local values(?,?,?,?,?,?)", [post.id,post.password, post.nickname,salt,post.name,file], function (err) {
                    request.login(post, function (err) {
                        request.session.save(function () {
                            return response.redirect('/');
                        });
                    });
                });
            }
        });
    });
    router.get('/logout', function (request, response) {
        request.logout();
        response.redirect('/');
    });
    router.get('/kakao', passport.authenticate('kakao'));
    router.get('/kakao/callback', passport.authenticate('kakao'), function (request, response) {
        if (!request.user) {
            console.log("kakao_Wrong credentials");
            return response.status(400).json({
                SERVER_MESSAGE: "카카오 로그인 불가",
            }).redirect('/login');
        } else {
            console.log("kakao_logged in!");
            return response.redirect('/');
        }
    });
    return router;
};