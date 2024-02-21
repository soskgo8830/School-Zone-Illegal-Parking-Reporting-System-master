var express = require('express');
var mysql = require("mysql");
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
    console.log('Connected!:) Admin');
  }
});

router.get('/get_list', function (req, res, next) {
  if(req.session.name != "admin"){
    res.redirect("/");
  }
  var list = "SELECT * FROM login";
  connect.query(list, function (err, result, field) {
    if (err) {
      console.log(err);
      res.writeHead(404);
    }
    else {
      res.send(JSON.stringify(result))
    }
  })
});

/* GET home page. */
router.get('/', function (req, res, next) {
  if(req.session.name != "admin"){
    res.redirect("/");
  }else{
    res.render('admin', { title: 'admin' });
  }
});

module.exports = router;