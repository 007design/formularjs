const express = require("express"),
  handlebars = require('handlebars'),
  sass = require('node-sass'),
  path = require('path'),
  fs = require('fs'),
	app = express();

handlebars.registerHelper('isText', field => {
  return field.fieldtypes_id === 1;
});
handlebars.registerHelper('styles', type => {
  return sass.renderSync({
    file: path.join(__dirname, 'views', type+'.scss')
  }).css;
});

// app.use("/", express.static(process.cwd()));

// app.get("/get/:type/:id/:view?", (req, res) => {
//   require('./api/get')(req.params.type,req.params.id,req.params.view).then(data => {
//     res.send(data);
//   });
// });

app.get("/view/:type/scripts.js", (req, res) => {
  res.type('text/javascript')
  res.sendFile(path.join(__dirname, 'views', req.params.type+'.js'));
});

app.get("/view/:type/:id", (req, res) => {
  if (req.xhr) {
    require('./api/get')('view',req.params.id,req.params.type).then(data => {
      const template = handlebars.compile(fs.readFileSync('./views/'+req.params.type+'.html', 'utf-8'))({
        view: req.params.type,
        data: data[0]
      });
      res.send({
        model: data[0],
        view: template
      });
    });
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(8000);