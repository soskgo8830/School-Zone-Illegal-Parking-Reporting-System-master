var express = require('express');
var mysql = require("mysql");
var multer = require('multer'); // multer모듈 적용 (for 파일업로드)
var fs = require("fs");
var path = require("path");


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var root = __dirname.replace("routes","");
    if(fs.existsSync(path.join(root,"public/images",String(req.session.name)))){
      cb(null,path.join(root,"public/images",String(req.session.name))) // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    }else{
      fs.mkdirSync(path.join(root,"public/images",String(req.session.name)),{recursive: true})
      cb(null,path.join(root,"public/images",String(req.session.name))) // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    }
  },
  filename: function (req, file, cb) {
    var th_date = Date.now();
    var name = file.originalname.split(".")
    var type = name[name.length-1]
    
    cb(null, th_date+"."+type) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})

var upload = multer({
  storage: storage
})
var router = express.Router();

var connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: '8830',
  database: "workbench",
  multipleStatements: true
});

connect.connect(function (error) {
  if (!!error) {
      console.log(error);
  } else {
      console.log('Connected!');
  }
});

router.post('/user_report',upload.single('image'),async (req,res,next)=> {
  if(req.session.name == undefined){
    res.send("Fail");
  }
  else{
    var username = req.body.username;
    var phonenumber = req.body.phonenumber;
    var date = req.body.date;
    var carnumber = req.body.carnumber;
    var imagename = req.file.path.split("public");
  
    var query = 'INSERT INTO report (username,phonenumber,date,carnumber,imagename) VALUES(?,?,?,?,?)';
    console.log(query);
    connect.query(query, [username, phonenumber, date, carnumber,imagename[imagename.length-1]], function (err, result, field) {
        if (err) {
            console.log(err);
        }
        else {
          res.send("success");
        }
    })
  }
})

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.name == undefined){
    res.redirect("/");
  }
  else{
    res.render('call', { title: 'call', name:req.session.name, number:req.session.number });
  }
});

module.exports = router;
