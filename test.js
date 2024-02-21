var spawn = require("child_process").spawn;
var path = require('path');

function test(){
    var py = spawn('python', ['test.py']);
    var pa = path.join("C:/Users/MS/Desktop/webAPP","public/images","15905643006883.jpg")
    var dataString = ""
    py.stdout.on('data', function (data) {
        dataString += data.toString("utf8");
        console.log(dataString);
    });
    py.stderr.on('data', function (data) {
        console.log("Error" + data);
    });
    py.stdout.on('end', function () {
        console.log(dataString)
    });
    py.stdin.write(JSON.stringify({"img":pa}));
    py.stdin.end();
}

async function main(){
    console.log(test())
}
main();