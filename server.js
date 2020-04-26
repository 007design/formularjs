const express = require("express"),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  handlebars = require('handlebars'),
  sass = require('node-sass'),
  // babel =require("@babel/core"),
  rollup = require('rollup'),
  rollUpBabel = require('rollup-plugin-babel'),
  rollUpCommonjs = require('@rollup/plugin-commonjs'),
  rollUpNodeResolve = require('@rollup/plugin-node-resolve'),
  path = require('path'),
  fs = require('fs'),
	app = express();

handlebars.registerHelper('isText', field => {
  return field.fieldtypes_id === 1;
});
handlebars.registerHelper('styles', view => {
  return sass.renderSync({
    file: path.join(__dirname, 'views', view, 'index.scss')
  }).css;
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.json());

// app.use("/", express.static(process.cwd()));

// app.get("/get/:type/:id/:view?", (req, res) => {
//   require('./api/get')(req.params.type,req.params.id,req.params.view).then(data => {
//     res.send(data);
//   });
// });

app.get("/:view/:type/scripts.js", (req, res) => {
  let sess = req.session;
  if (!sess.user)
    req.params.type = "login";

  async function build() {
    // babel.transformFileSync(path.join(__dirname, 'views', req.params.view, req.params.type+'.js'),{
    //   minified: true
    // }).code
    const bundle = await rollup.rollup({
      input: path.join(__dirname, 'views', req.params.type, 'index.js'),
      plugins: [
        rollUpNodeResolve({
          browser: true,
          extensions: ['.js']
        }),
        rollUpCommonjs(),
        rollUpBabel({
          exclude: 'node_modules/**'
        })
      ]
    });

    const {output} = await bundle.generate({
      format: 'iife'
    });

    return output[0].code;
  }

  build().then(output => {
    res.type('text/javascript')
    res.send(output)
  })
  // res.send(babel.transformSync(fs.readFileSync(path.join(__dirname, 'views', req.params.view, req.params.type+'.js'), 'utf-8'),{
  //   minified: true
  // }).code);
});

app.get("/:view/:type/styles.css", (req, res) => {
  let sess = req.session;
  if (!sess.user)
    req.params.type = "login";

  res.type('text/css')
  res.send(sass.renderSync({
    file: path.join(__dirname, 'views', req.params.type, 'index.scss')
  }).css);
});

app.get("/view/:type/:id", (req, res) => {
  if (req.xhr) {
    let sess = req.session;
    if (!sess.user) {
      const template = handlebars.compile(fs.readFileSync('./views/login/index.html', 'utf-8'))({
        view: 'login'
      });
      res.send({
        view: template,
        model: {views_name: "Login"}
      });
    } else
      require('./api/get')('view',req.params.id,req.params.type).then(data => {
        const template = handlebars.compile(fs.readFileSync('./views/'+req.params.type+'/index.html', 'utf-8'))({
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

app.get("/edit/:type/:id", (req, res) => {
  if (req.xhr) {
    require('./api/get')(req.params.type,req.params.id,'edit').then(data => {
      // const template = handlebars.compile()();
      res.send({
        model: data[0],
        view: fs.readFileSync('./views/'+req.params.type+'/index.html', 'utf-8')
      });
    });
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.post("/login", (req, res) => {
  let sess = req.session;
  sess.user = req.body.user;

  console.log(sess)
  console.log(req.body)

  res.send({})
});

app.listen(8000);