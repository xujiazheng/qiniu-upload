/**
 * 七牛云上传图片接口，支持多图片上传，返回paths数组为图片路径；
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var qnUpload = require('./upload');

var port = 9000;
var app = express();
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

var uploadFile = (files) => {
    var uploadPromiseAll = Object.keys(files).map(key => {
        var item = files[key];
        return qnUpload(item.name, item.path);
    });

    return Promise.all(uploadPromiseAll);
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});
// app.get('/style.css', (req, res) => {
//     res.sendFile(path.join(__dirname, './style.css'));
// });
// app.get('/jquery.tmpl.js', (req, res) => {
//     res.sendFile(path.join(__dirname, './jquery.tmpl.js'));
// });

app.post('/upload', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {

        uploadFile(files).then(paths => {
            res.send({paths}).end();
        }).catch(err => {
            console.log(err);
        });
    });
});

process.on('uncaughtException', (err) => {
    console.error(err.stack);
});

app.listen(port, () => {
    console.log(`server run in ${port} port...`);
});

