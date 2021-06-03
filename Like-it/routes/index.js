var express = require('express');
var router = express.Router();
const authCheck = require('../lib/auth_check.js');
const upload = require('../lib/Multer.js');
const db = require('../lib/db.js');
/* GET home page. */

router.get('/', function (req, res, next) {

  res.render('index', {
    main: req.user
  });
});
router.get('/contents/:category/page/:page', authCheck, (req, res) => {

  const sql = "SELECT num,name,owner,likes,numParticipants FROM rooms WHERE contents=? LIMIT ?,?";
  const category = req.params.category;
  const page = (req.params.page * 10) - 10; // 파라미터 page가 1이면 0 ,2이면 10  
  const pageLimit = 10;
  let page_num = 0;

  //page 부터 10개(pagelimit)씩 검색하여 렌더링함  
  db.query(sql, [category, page, pageLimit], (err, rooms) => {
    db.query(sql, [category, 0, 10000], (err, pages) => {
      page_num = Math.floor(pages.length / 10) + 1 //페이지의 개수 파악

      res.render('rooms', {
        main: req.user,
        category: req.params.category,
        rooms,
        current_page: req.params.page *= 1, //string -> int 형변환
        page_num
      });
    })
  })
})
router.post('/contents/:category/room/:room/picture', upload.single('gif'), async (req, res) => {
  try {
    const msg = {};
    const now = new Date();
    msg.time = now.toLocaleString();
    msg.sended = req.user.id;
    msg.sended_Nickname = req.user.nickname;
    msg.profile_image = req.user.profile_image;
    msg.gif_src = `images/${req.file.filename}`;

    //클라이언트가 메세지로 GiFsEnDeD를 받으면 gif_src로 gif를 받아옴
    const sql = "INSERT INTO chat (room, description,sended,sended_nickname,time,profile_image,gif_src) VALUES (?,'',?,?,?,?,?)";

    db.query(sql, [req.params.room, msg.sended, msg.sended_Nickname, msg.time, msg.profile_image, msg.gif_src], (err, result) => {
      req.app.get('chat').to(req.params.room).emit('chat_sended_to_client', msg);
      res.send('ok');
    })

  } catch (err) {
    console.error(err);
  }
})
router.get('/contents/:category/makeroom', authCheck, (req, res) => {
  const category = req.params.category;

  res.render('makeRoom', {
    main: req.user,
    category: req.params.category
  });
})
router.post('/contents/:category/makeroom', authCheck, (req, res) => {
  const contents = req.params.category;
  console.log("post", req.user)
  const name = req.body.name;
  const owner = req.user.nickname;
  const likes = req.body.likes;

  const sql = "INSERT INTO rooms (contents,name,owner,likes,numParticipants) VALUES (?,?,?,?,?)";
  const LAST = "SELECT LAST_INSERT_ID() AS id";

  db.query(sql, [contents, name, owner, likes, 1], (err, result) => { //방정보 db삽입
    db.query(LAST, (err, id) => { //방금 삽입한 방 정보 가져옴
      res.redirect(`/contents/${contents}/room?room=${id[0].id}`) //방금 만든 방으로 리다이렉 시킴
    })
  })
})
router.get('/contents/:category/room', authCheck, (req, res) => {
  let {room} = req.query
  console.log("param",req.params)
  const user = req.user;  
  const sql_1 = "SELECT * FROM rooms WHERE num=?"; //room info
  const sql_2 = "SELECT * FROM participants WHERE room=?"; //participants
  const roomnum = room * 1;
  const category = req.params.category;
  db.query(sql_1, [room], (err, result) => {
    // 방 정보 
    console.log("param",result[0].params)
    const roomname = result[0].name;
    //방에 참가하고 있는 인원들 객체 배열 [ {"id":"1123",name: "asdfa","nickname":"LALA" ,"profile_image":"123"} , ... ]
    db.query(sql_2, [room], (err, people) => {

      // 원래 이전 채팅을 불러왔으나 불러올 필요가 없음을 깨닫고 불러오는 부분 없앰 2018-12-02 00시경 commit
      res.render('chat', {
        main: user,
        roomnum,
        people,
        category,
        roomname
      })
    })
  })
})



module.exports = router;