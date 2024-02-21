var createError = require('http-errors');
var express = require('express');
var spawn = require("child_process").spawn;
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer'); // multer모듈 적용 (for 파일업로드)
var session = require("express-session");

var userRouter = require('./routes/user');
var loginRouter = require('./routes/login');
var adminRouter = require('./routes/admin');
var callRouter = require('./routes/call');
var adminReportRouter = require('./routes/adminReport');
var fs = require("fs")
var app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,path.join(__dirname,"public/images")) // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    var th_date = Date.now();
    var name = file.originalname.split(".")
    var type = name[name.length-1]
    cb(null, req.session.name+th_date+"."+type) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})

var upload = multer({
  storage: storage
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({secret: "asd123asd", resave: false, saveUninitilalized: true})
)
app.post("/Car",upload.single('image'),async(req,res)=>{
  var py = spawn('python', ['test.py']);
  var pa = path.join(__dirname,"public/images",req.file.filename)
  
  console.log(pa)
  var dataString = "";
  py.stdout.on('data', function (data) {
    fs.writeFile('test.txt', data, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
    dataString += data.toString();
  });
  py.stderr.on('data', function (data) {
    console.log("Error" + data);
  });
  py.stdout.on('end', function () {
    fs.unlink(pa,function(err){
      if(err){
        throw (err);
      }
    });
    res.send(dataString); 
  });
  py.stdin.write(JSON.stringify({"img":pa}));
  py.stdin.end();
})
app.use('/', loginRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/call',callRouter);
app.use('/adminReport',adminReportRouter);

module.exports = app;