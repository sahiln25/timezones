const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./api/model/db');
const cors = require('cors')

const index = require('./api/routes/index');
const auth = require('./api/routes/authentication');
const user = require('./api/routes/user');
const record = require('./api/routes/record');

const port = 3000;

const app = express();

//View Engine
app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

app.use('/', index);
app.use('/authentication', auth);
app.use('/user', user);
app.use('/record', record);

// set up our one route to the index.html file
app.get('*', function (req, res){
    res.render(path.join(__dirname+'/client/src/index.js'));
});

app.listen(port, function() {
    console.log("Server started on port " + port);
});