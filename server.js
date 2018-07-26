const express = require('express');
const  hbs = require('hbs');
const fs = require('fs')
const notes = require('./notes.js')
const generator = require('./app.js')
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;


var textToAudio = JSON.parse(fs.readFileSync('textToAudio4.json', 'utf8'));
var data = JSON.parse(fs.readFileSync('notes-data.json', 'utf8'));

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })

// app.post('/editor', urlencodedParser, function (req, res) {
//     console.log(req.body);
//     notes.update(req.body.instruments, "title place holder", req.body.textshort, "textdetail placeholder");
//     res.render('c log number')
//   })

app.post('/editor', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400)
    {
        console.log(req.body);
        notes.update(req.body.instruments, notes.getNote(req.body.instruments).title, req.body.textshort, req.body.textdetail);
        res.render('editor.hbs', {
            pageTitle: 'Saved'
        });
    }
    
  });


hbs.registerPartials(__dirname +'/views/partials')
app.set('view engine', 'hbs');



app.use((req, res, next) => {                               //middleware example: request logger
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log +'\n', (err) => {
        if(err){
            console.log('Unable to append to server log.')
        }
    })
    next();
});


hbs.registerHelper('getCurrentYear', ()=>{  //function without an argument
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {      //function with an argument  hbs syntax:   {{screamIt text}}
    return text.toUpperCase();
})

hbs.registerHelper('getTextShort', (filename) => { 
    return notes.getNote(filename).textshort;
})

hbs.registerHelper('getTextDetail', (filename) => { 
    return notes.getNote(filename).textdetail;
})

app.get('/editor', (req, res) => {
    res.render('editor.hbs', {
        welcome: 'Welcome James!'
    });
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        welcomeMessage: 'Welcome to the AR-Craft Instructor Portal!',
        pageTitle: 'Home Page'
    });
});

app.get('/json', (req, res) => {
    res.send(textToAudio);
  });

app.use(express.static(__dirname + '/generatedFiles'));
app.use(express.static(__dirname + '/public'));



app.listen(port, ()=>{
    console.log(`Server is up on  port ${port}`)
});
