fs = require('fs');
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

function getGeoAnswers(difficultyLevel) {
  let answer = countries[Math.floor(Math.random() * countries.length)];
  let answerArr = ['', '', '', ''];
  if (difficultyLevel == "med") {
    let index = Math.floor(Math.random() * 4);
    answerArr[index] = answer;
    for (let i = 0; i < 4; i++) {
      let j = Math.floor(Math.random() * countries.length);
      let country = countries[j];
      if (i != index) {
        while (answerArr.indexOf(country) != -1) { 
          j++;
          country = countries[j];
        }
        answerArr[i] = country;
      }
    }
  }
  return { answer: answer, answerArr: answerArr };
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
              quiz.correct++; quiz.streak++;
              res.json({
                "result": "correct"
              });
            } else {
              quiz.streak = 0;
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
              let geo = getGeoAnswers(q.difficulty);
              let correct = geo.answer, answerArr = geo.answerArr;
              q.answer = correct;
              q.possibleAnswers = answerArr;

              writeJSON(quizzes);
            } else {
              let difficultyLevel = req.query.difficultyLevel ? req.query.difficultyLevel : "hard";
              let geo = getGeoAnswers(difficultyLevel);
              let correct = geo.answer, answerArr = geo.answerArr;

              id = Math.floor(Math.random() * 1000000000000);
              quizzes[`${id}`] = {
                answer: correct,
                correct: 0,
                streak: 0,
                question: 1,
                difficulty: difficultyLevel,
                possibleAnswers: answerArr
              };

              writeJSON(quizzes);

              res.redirect(`/quiz?id=${id}`);
            }
            
            let quiz = quizzes[`${id}`];

            if (quiz.question > 5) {
              quiz.questionType = "country-flag";
              quiz.prompt = "Which country's flag is this?"
            } else {
              quiz.questionType = "country-image";
              quiz.prompt = "Which country is this?"
            }

            res.render('quiz/index.html.ejs', {
                darkMode: true,
                id: id,
                jsScripts: scripts,
                stylesheets: stylesheets,

                difficultyLevel: quiz.difficulty,
                question: quiz.question,
                answer: quiz.answer,
                answers: quiz.possibleAnswers,
                questionType: quiz.questionType,
                prompt: quiz.prompt,
                correct: quiz.correct,
                streak: quiz.streak
            });
        });
    }
}