fs = require('fs');
const countries = require('../question_assets/geography/countries.json');
const greek = require('../question_assets/mythology/greek_gods.json');

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

function getGreekAnswers(difficultyLevel) {
  let answer = greek[Math.floor(Math.random() * greek.length)];
  let answerArr = ['', '', '', ''];
  if (difficultyLevel == "med") {
    let index = Math.floor(Math.random() * 4);
    answerArr[index] = answer;
    for (let i = 0; i < 4; i++) {
      let j = Math.floor(Math.random() * greek.length);
      let god = greek[j];
      if (i != index) {
        while (answerArr.indexOf(god) != -1) { 
          j++;
          god = greek[j];
        }
        answerArr[i] = god;
      }
    }
  }
  return { answer: answer, answerArr: answerArr };
}

function getAnswers(question, difficultyLevel) {
  let ret;
  if (question > 10) {
    ret = getGreekAnswers(difficultyLevel);
    ret.questionType = "greek-gods";
    ret.prompt = "What Greek god matches the above description?";
  } else if (question > 5) {
    ret = getGeoAnswers(difficultyLevel);
    ret.questionType = "country-flag";
    ret.prompt = "Which country's flag is this?";
  } else {
    ret = getGeoAnswers(difficultyLevel);
    ret.questionType = "country-image";
    ret.prompt = "Which country is this?";
  }
  return ret;
}

function isAnswerCorrect(answer, req, type) {
  switch (type) {
    case 'country-flag':
    case 'country-image':
      return answer.country.toLowerCase().replace(/[^a-z]/g, '') == req.body.answer;
    case 'greek-gods':
      return answer.name.toLowerCase().replace(/[^a-z]/g, '') == req.body.answer;
    default:
      return false;
  }
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
            if (isAnswerCorrect(quiz.answer, req, quiz.questionType)) {
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
            quiz.reloadRequired = true;
            writeJSON(quizzes);
          }
        });

        app.get('/quiz', function (req, res) {

            let id;
            if (req.query.id != undefined) { 
              id = req.query.id
              let q = quizzes[`${id}`];
              if (q.reloadRequired) {
                let setup = getAnswers(q.question, q.difficulty);
                q.answer = setup.answer;
                q.possibleAnswers = setup.answerArr;
                q.questionType = setup.questionType;
                q.prompt = setup.prompt;

                writeJSON(quizzes);
              }
            } else {
              let difficultyLevel = req.query.difficultyLevel ? req.query.difficultyLevel : "hard";
              let setup = getAnswers(0, difficultyLevel);

              id = Math.floor(Math.random() * 1000000000000);
              quizzes[`${id}`] = {
                answer: setup.answer,
                correct: 0,
                streak: 0,
                question: 1,
                difficulty: difficultyLevel,
                possibleAnswers: setup.answerArr,
                reloadRequired: false,
                questionType: setup.questionType,
                prompt: setup.prompt
              };

              writeJSON(quizzes);

              res.redirect(`/quiz?id=${id}`);
            }
            
            let quiz = quizzes[`${id}`];

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