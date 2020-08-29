var express = require('express');
var app = express();
const user = require('./user.json');
const bodyParser = require("body-parser")
const fs = require("fs");
const tweet = require('./tweet.json');


app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('welcome to home page!');
});

app.post('/signup', function (req, res) {
  try {
    let data = req.body.username;
    if (data[0] != '@') {
      res.status(400).send('Invalid handle!')
    }
    else if (user.findIndex(user => user == data) != -1) {
      res.status(409).send('user already exist');
    }
    else {
      user.push(data);
      fs.writeFile("user.json", JSON.stringify(user), err => {
        // Checking for errors 
        if (err) throw err;
        console.log("Done writing"); // Success 
      });
      res.status(200).send('done!')
    }
  }
  catch (err) {
    res.status(500).send('Something went wrong!')
  }

});

app.post('/tweet', function (req, res) {
  let data = {
    user: req.body.user,
    tweet: req.body.tweet
  };
  if (user.findIndex(user => user == data.user) == -1) {
    res.status(404).send('user not exist');
  }
  else if (data.tweet.length >= 20) {
    res.status(400).send('tweet can be of max 20 characters');
  }
  else {
    tweet.unshift(data);
    fs.writeFile("tweet.json", JSON.stringify(tweet), err => {
      // Checking for errors 
      if (err) throw err;
      console.log("Done writing"); // Success 
    });
    res.status(200).send('done!')
  }
});

app.get('/myTweets/:user', function (req, res) {
  let data = req.params.user;
  let resp = tweet.filter(obj => {
    if (obj.user == data) {
      return obj.tweet
    }
  });
  res.send(resp);
});

app.get('/myMentions/:user', function (req, res) {
  let data = req.params.user;
  let resp = [];
  tweet.forEach(obj => {
    const splitTweet = obj.tweet.split(' ');
    if (splitTweet.some(ele => ele == data)) {
      resp.push(obj);
    }
  });
  res.send(resp);
});

app.listen(9000, function () {
  console.log('Example app listening on port 9000!');
});
