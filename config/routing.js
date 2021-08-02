fs = require('fs');
const { count } = require('console');
const countries = require('../question_assets/geography/countries.json');

var quizzes = require('../db/quizzes.json');

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

function writeJSON(json) {
  fs.writeFile('./db/quizzes.json', JSON.stringify(json), (err) => {
    if (err) {
        throw err;
    }
  });
}

function getAnswers(difficultyLevel, answer) {
  let answerArr = ['', '', '', ''];
  if (difficultyLevel == "med") {
    let position = Math.floor(Math.random() * 4);
    for (let i = 0; i < 4; i++) {
      let country = countries[Math.floor(Math.random() * countries.length)];
      if (i != position && answerArr.indexOf(country) == -1) answerArr[i] = country;
    }
    answerArr[position] = answer;
  }
  return answerArr;
}

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
          let quiz = quizzes[`${req.body.id}`]; 
          if (quiz) {
            if (quiz.answer.country.toLowerCase().replace(/[^a-z]/g, '') == req.body.answer) {
              res.json({
                "result": "correct"
              });
            } else {
              res.json({
                "result": "incorrect"
              });
            }
            //delete quizzes[`${req.body.id}`];
            quiz.question++;
            writeJSON(quizzes);
          }
        });

        app.get('/quiz', function (req, res) {

            let id;
            if (req.query.id != undefined) { 
              id = req.query.id
              let q = quizzes[`${id}`];
              let correct = countries[Math.floor(Math.random() * countries.length)];
              let answerArr = getAnswers(q.difficulty, correct);
              q.answer = correct;
              q.possibleAnswers = answerArr;

              writeJSON(quizzes);
            } else {
              let correct = countries[Math.floor(Math.random() * countries.length)];

              let difficultyLevel = req.query.difficultyLevel ? req.query.difficultyLevel : "hard";
              let answerArr = getAnswers(difficultyLevel, correct);

              id = Math.floor(Math.random() * 1000000000);
              quizzes[`${id}`] = {
                answer: correct,
                question: 1,
                difficulty: difficultyLevel,
                possibleAnswers: answerArr
              };

              writeJSON(quizzes);

              res.redirect(`/quiz?id=${id}`);
            }

            console.log(quizzes);
            console.log(id);
            let quiz = quizzes[`${id}`];

            console.log(quiz);

            res.render('quiz/index.html.ejs', {
                darkMode: true,
                id: id,
                jsScripts: scripts,
                stylesheets: stylesheets,

                difficultyLevel: quiz.difficulty,
                question: quiz.question,
                country: quiz.answer,
                answers: quiz.possibleAnswers
            });
        });
    }
}