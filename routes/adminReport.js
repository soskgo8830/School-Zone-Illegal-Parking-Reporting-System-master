var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: '8830',
  database: "workbench",
  multipleStatements: true
})

connect.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log('Connected!:) Report');
  }
});

router.get('/get_reportList', function (req, res, next) {
  if (req.session.name != "admin") {
    res.redirect('/');
  }
  var list = "SELECT username,phonenumber,date,carnumber,imagename FROM report";
  connect.query(list, function (err, result, field) {
    if (err) {
      console.log(err);
      res.writeHead(404);
    }
    else {
      console.log(result);
      res.send(JSON.stringify(result));
    }
  })
})

router.get('/', function (req, res, next) {
  if (req.session.name != "admin") {
    res.redirect("/");
  } else {
    res.render('adminReport', { title: 'adminReport' });
  }
})

module.exports = router;