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

const sendLogin = (res, id) => {
  const template = handlebars.compile(fs.readFileSync('./views/login/index.html', 'utf-8'))({
    views_id: id
  });
  res.send({
    view: template,
    model: {views_name: "Login"}
  });
};

const sendError = (res, err) => {
  const template = handlebars.compile(fs.readFileSync('./views/error/index.html', 'utf-8'))({
    error: err
  });
  res.send({
    view: template,
    model: {views_name: "Error"}
  });
};

const hasPermission = async function(view, user) {
  const get = require('./api/get')
  const ok = await get({
    key: 'userview',
    conditions: {
      views_id: view,
      users_id: user
    }
  });

  return ok.length > 0;
};

handlebars.registerHelper('isText', field => {
  return field.fieldtypes_id === 1;
});
handlebars.registerHelper('isSelect', field => {
  return field.fieldtypes_id === 2;
});
handlebars.registerHelper('isCheckbox', field => {
  return field.fieldtypes_id === 3;
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
  });
});

// app.get("/:view/:type/styles.css", (req, res) => {
//   let sess = req.session;
//   if (!sess.user)
//     req.params.type = "login";

//   res.type('text/css')
//   res.send(sass.renderSync({
//     file: path.join(__dirname, 'views', req.params.type, 'index.scss')
//   }).css);
// });

app.get("/view/:type/:id", (req, res) => {
  if (req.xhr) {
    let sess = req.session;
    if (!sess.user)
      sendLogin(res, req.params.id);
    else
      hasPermission(req.params.id, sess.user).then(async function(ok) {
        let data;
        if (!ok)
          return sendError(res, 'insufficient access');
        else            
          data = await require('./api/get')({
            key: 'view',
            id: req.params.id,
            view: req.params.type
          })

        if (data && data.length === 1) {
          const template = handlebars.compile(fs.readFileSync('./views/'+req.params.type+'/index.html', 'utf-8'))({
            view: req.params.type,
            data: data[0]
          });
          res.send({
            model: data[0],
            view: template
          });
        } else
          sendError(res, 'view not found');
      });
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.get("/edit/:type/:id", (req, res) => {
  if (req.xhr) {
    let sess = req.session;
    if (!sess.user)
      sendLogin(res, req.params.id);
    else
      require('./api/get')({
        key: req.params.type,
        id: req.params.id,
        view: 'edit'
      }).then(data => {
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

  require('./api/get')({
    key: 'user',
    view: 'login',
    conditions: {
      users_name: req.body.user
    }
  }).then(data => {
    let result = {
      status: "access denied"
    };

    if (data.length !== 1)
      result.status = "invalid user"
    else {
      sess.user = data[0].users_id;
      
      if (req.body.view)
        data[0].userviews.forEach(userview => {
          if (userview.views_id === parseInt(req.body.view)) {
            result.status = "ok";
          }
        });
    }
    res.send(result);
  });
});

app.listen(8000);