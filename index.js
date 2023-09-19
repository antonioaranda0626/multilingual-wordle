const PORT = process.env.PORT || 10000
const axios = require("axios").default
const express = require("express")
const app = express()
const cors = require('cors')
var spanishWords = require('an-array-of-spanish-words')
var frenchWords = require('an-array-of-french-words')
const fs = require("fs");
const path = require('path');


require('dotenv').config()

app.use(express.static('public'))

app.use(cors())

app.get('/english-word', (req, res) => {


  const options = {
    method: 'GET',
    url: 'https://random-words5.p.rapidapi.com/getRandom',
    params: { wordLength: '5' },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'random-words5.p.rapidapi.com'
    }
  };

  axios.request(options).then(function (response) {
    console.log(response.data);
    res.json(response.data);
  }).catch(function (error) {
    console.error(error);
  });
});

app.get('/spanish-word', (req, res) => {

  const options = {
    method: 'GET',
    url: 'https://random-words-spanish-and-french.p.rapidapi.com/spanish/one-word/5',
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'random-words-spanish-and-french.p.rapidapi.com'
    }
  };

  axios.request(options).then(function (response) {
    console.log(response.data);
    res.json(response.data)
  }).catch(function (error) {
    console.error(error);
  });

});

app.get('/french-word', (req, res) => {

  const axios = require("axios");
  const options = {
    method: 'GET',
    url: 'https://random-words-spanish-and-french.p.rapidapi.com/french/one-word/5',
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'random-words-spanish-and-french.p.rapidapi.com'
    }
  };
  axios.request(options).then(function (response) {
    console.log(response.data);
    res.json(response.data)
  }).catch(function (error) {
    console.error(error);
  });

});



app.get('/check-english', (req, res) => {

  const guess = req.query.word

  const options = {
    method: 'GET',
    url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/association/',
    params: { entry: guess },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'twinword-word-graph-dictionary.p.rapidapi.com'
    }
  };

  axios.request(options).then(function (response) {
    console.log(response.data);
    res.json(response.data.result_msg)
  }).catch(function (error) {
    console.error(error);
  });
})

app.get('/check-french', (req, res) => {
  const guess = req.query.word
  if (frenchWords.indexOf(guess) == -1) {
    res.json('Entry word not found')
  }
  else {
    res.json('Success!')
  }
})

app.get('/check-spanish', (req, res) => {
  const guess = req.query.word
  if (spanishWords.indexOf(guess) == -1) {
    res.json('Entry word not found')
  }
  else {
    res.json('Success!')
  }
})


app.get('/make-custom', (req, res) => {
  let tmpDir = fs.mkdtemp("public/custom-wordle/custom-", (error, folder) => {
    if (error) {
      console.log(error)
    }

    var readStream1 = fs.createReadStream(process.cwd() + '/custom/custom.html')
    var writeStream1 = fs.createWriteStream(process.cwd() + "/" + folder + '/custom.html')

    readStream1.pipe(writeStream1)
    readStream1.on('end', function () {
      console.log("File copied!")
    });
    readStream1.on('error', function (err) {
      console.error(err)
    });

    var readStream2 = fs.createReadStream(process.cwd() + '/custom/customWordle.js')
    var writeStream2 = fs.createWriteStream(process.cwd() + "/" + folder + '/customWordle.js')
    readStream2.pipe(writeStream2);
    readStream2.on('end', function () {
      console.log("File copied!")
    });
    readStream2.on('error', function (err) {
      console.error(err)
    });

    var readStream3 = fs.createReadStream(process.cwd() + '/custom/stylesCpy.css')
    var writeStream3 = fs.createWriteStream(process.cwd() + "/" + folder + '/stylesCpy.css')

    readStream3.pipe(writeStream3)
    readStream3.on('end', function () {
      console.log("File copied!")
    });
    readStream3.on('error', function (err) {
      console.error(err)
    });

    let pathArr = folder.split("/")

    let response = path.join(pathArr[1], pathArr[2])
    res.json(response);
  })
})

app.listen(PORT, () => console.log('Server on port ' + PORT))


