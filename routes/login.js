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
        console.log('Connected!:) Login');
    }
});

router.post('/check', function (req, res, next) {
    var id = req.body.user_login;
    var pass = req.body.user_pass;

    var check = "select * from login where Username='" + id + "' AND Password='" + pass + "'";

    console.log(check);
    connect.query(check, function (err, result, field) {
        var string=JSON.stringify(result);
        var json = JSON.parse(string)
        if (err) {
            console.log(err);
        }
        else if (result.length == 0) {
            res.redirect("/login");
        }
        else if (id == 'admin') {
            req.session.id = id;
            req.session.email = json[0]['Email']
            req.session.number = json[0]['Number']
            req.session.name =  json[0]['Username']
            res.redirect("/admin");
        }
        else {
            console.log(json[0])
            req.session.id = id;
            req.session.email = json[0]['Email']
            req.session.number = json[0]['Number']
            req.session.name =  json[0]['Username']
            res.redirect("/user")
        }
    })
})

router.post('/signUp', function (req, res, next) {
    var user_name = req.body.user_name;
    var user_pass = req.body.user_pass;
    var user_email = req.body.user_email;
    var user_number = req.body.user_number;

    var query = 'INSERT INTO login (Username,Password,Email,Number) VALUES(?,?,?,?)';

    connect.query(query, [user_name, user_pass, user_email, user_number], function (err, result, field) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/");
        }
    })
})
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('login', { title: 'Login' });
});

module.exports = router;