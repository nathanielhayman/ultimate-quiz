fs = require('fs');

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

        app.get('/quiz', function (req, res) {
            res.render('quiz/index.html.ejs', {
                darkMode: true,
                jsScripts: scripts,
                stylesheets: stylesheets
            });
        });
    }
}