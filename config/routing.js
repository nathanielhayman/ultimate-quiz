fs = require('fs');
const { count } = require('console');
const countries = require('../question_assets/geography/countries.json');

quizzes = {};

let scripts = [];

fs.readdir('./assets/js', (err, files) => {
  files.forEach(file => {
    scripts.push(file);
  });
});

let stylesheets = [];

fs.readdir('./assets/css', (err, files) => {
  files.forEach(file => {
    stylesheets.push(file);
  });
});

module.exports = {
    configure: (app) => {
        app.get('/', function (req, res) {
            res.render('homepage/index.html.ejs', {
                darkMode: true,
                jsScripts: scripts,
                stylesheets: stylesheets
            });
        });

        app.post('/check-answer', function(req, res) {
          console.log(req.body);
          if (quizzes[`${req.body.id}`]) {
            if (quizzes[`${req.body.id}`]["country"].toLowerCase().replace(/[^a-z]/g, '') == req.body.answer) {
              res.json({
                "result": "correct"
              });
            } else {
              res.json({
                "result": "incorrect"
              });
            }
            delete quizzes[`${req.body.id}`];
          }
        });

        app.get('/quiz', function (req, res) {

            let correct = countries[Math.floor(Math.random() * countries.length)];

            let answerArr = ['', '', '', ''];
            let difficultyLevel = req.query.difficulty ? req.query.difficulty : "hard";
            if (difficultyLevel == "med") {
              let position = Math.floor(Math.random() * 4);
              for (let i = 0; i < 4; i++) {
                let country = countries[Math.floor(Math.random() * countries.length)];
                if (i != position && answerArr.indexOf(country) == -1) answerArr[i] = country;
              }
              answerArr[position] = correct;
            }

            let id;
            if (req.query.idNum != undefined) id = req.query.idNum
            else initID();

            function initID() {
              console.log('a');
              id = Math.floor(Math.random() * 1000000000);
              quizzes[`${id}`] = correct;
            }

            console.log(id);

            res.render('quiz/index.html.ejs', {
                darkMode: true,
                id: id,
                jsScripts: scripts,
                stylesheets: stylesheets,
                seed: req.query.seed ? req.query.seed : 000000,
                difficultyLevel: difficultyLevel,
                question: req.query.question ? req.query.question : 1,
                country: correct,
                answers: answerArr
            });
        });
    }
}