const sha = require('sha256');
const db = require('./db.js');
const KakaoStrategy_options = require('./kakao_option.js');
const Session_Option = require('./session.js');
var session = require('express-session');
module.exports = function (app) {

    app.use(session(Session_Option));
    const passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy,
        KakaoStrategy = require('passport-kakao').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) { //첫 인증시 호출됨
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) { //done에서 2번째 인자로 request.user라는 인자 전달해줌 
        db.query('SELECT * FROM auth_local WHERE id = ?', [id], function (err, user) {
            if (user[0] === undefined) {
                db.query('SELECT * FROM auth_kakao WHERE id = ?', [id], function (err, user) {
                    return done(err, user[0]) //카카오 가져오기
                })
            } else {
                return done(err, user[0]); //로컬 가져오기
            }
        });
    });

    passport.use(new LocalStrategy({
            usernameField: 'id', //폼 데이터 형식 바꿔줌
            //passwordField: 'passwd'
            session: true, //세션 저장 유무
            passReqToCallback: false
        },
        function (id, password, done) {
            db.query('SELECT * FROM auth_local WHERE id = ?', [id], function (err, user) {

                if (user[0] === undefined) {
                    console.log('Nonexistent id.');
                    return done(null, false, {
                        message: 'Nonexistent id.'
                    });
                }
                // if (user[0].password !== sha(password + user[0].salt)) 
                if(user[0].password != password) {
                    console.log('Incorrect password.');
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                console.log('success');
                return done(null, user[0]);
            })
        }));
    passport.use(new KakaoStrategy(
        KakaoStrategy_options,
        function (request, accessToken, refreshToken, profile, done) {
            // 사용자의 정보는 profile에 들어있다.
            db.query('SELECT id FROM auth_kakao WHERE id = ?', profile.id, function (err, result) {
                if (result[0]) {
                    console.log("login with kakao");
                    return done(null, profile);
                } // 회원 정보가 있으면 로그인
                console.log("!~~~~22");
                db.query('INSERT INTO auth_kakao (id,name,nickname,profile_image) VALUES (?,?,?,?)',
                    [profile.id, profile.username, profile.displayName, profile._json.properties.profile_image],
                    function (err, result) {
                        console.log("register with kakao");
                        request.login(profile, function (err) {
                            request.session.save(function () {
                                return done(null, profile); // 새로운 회원 생성 후 로그인
                            })
                        })
                    });
            });
        }
    ))
    return passport;
}