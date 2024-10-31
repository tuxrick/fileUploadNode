'use strict'

const express = require('express'); 
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

require('dotenv').config();

let cors = require('cors');
const cors_option = {
	origin: true,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	exposedHeaders: ["x-auth-token"]
};

let app = express();
let router = express.Router();

app.use(cors(cors_option));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

async function moveFile(file, path) {
    return new Promise((resolve, reject) => {
        file.mv(path, function(err) {
            if (err) {
                //console.log(JSON.stringify(err));
                //console.log("wrong or corrupted header file");
                reject(false);
            } else {
                resolve(path);
            }
        });
    });
}

app.get('/',(req,res)=>res.send("<h2>It Works!</h2>"));

app.post('/upload', async (req,res)=>{
    const ts = new Date().valueOf();
    if (req.files) {
        let file = await moveFile(req.files.photo_file, 'media/'+ts+'.jpg');
        res.json({status: 'OK', path: file});
    }else {
        res.json({status: 'ERROR', message: 'File not uploaded'});
    }


});

//media 
app.use(express.static('./media'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log("server running in port " + port);
});