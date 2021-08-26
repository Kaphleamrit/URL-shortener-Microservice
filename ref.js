require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

try {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
} catch (e) {
    console.log("err " + e);
}


const port = process.env.PORT || 3000;

const urlSchema = new mongoose.Schema({
    url: String,
    id: Number
});

const UrlModel = mongoose.model('url', urlSchema);

// 1301530000288578

const saveToDb = (urlle, done) => {

    const urll = new UrlModel({ url: urlle });

    urll.save(function(err, doc) {
        if (err) return console.log(err);
        done(null, doc);
    });
}


app.post('/api/shorturl/', function(req, res) {
    res.json({

    });
})



saveToDb("https://www.google.com", (err, document) => {
    if (err) return console.log(err);
    console.log(document);
})



app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
    res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {

})

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});


//todo
// post url to /api/shorturl and get a json response with original_url 
// eg { original_url : 'https://freeCodeCamp.org', short_url : 1}

// when visited to /api/shorturl/<short-url> redirect to the original URL.

//if invalid URL is passed return JSON with {error: 'invalid url'}
// dns.lookup(host, cb)