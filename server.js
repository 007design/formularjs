const express = require('express'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  handlebars = require('handlebars'),
  sass = require('node-sass'),
  rollup = require('rollup'),
  rollUpBabel = require('@rollup/plugin-babel').babel,
  rollUpCommonjs = require('@rollup/plugin-commonjs'),
  rollUpNodeResolve = require('@rollup/plugin-node-resolve').nodeResolve,
  path = require('path'),
  fs = require('fs').promises,
  app = express(),
  get = require('./api/get');

const getLogin = async function(id) {
  const template = await fs.readFile('./views/login/index.html', 'utf-8');
  const compiled = handlebars.compile(template)({
    views_id: id,
  })
  
  return {
    view: compiled,
    model: { views_name: 'Login' },
  };
}

const getError = async function(err) {
  const template = await fs.readFile('./views/error/index.html', 'utf-8');
  const compiled = handlebars.compile(template)({
    error: err,
  })
  return {
    view: compiled,
    model: { views_name: 'Error' },
  };
}

const hasViewPermission = async function (view, user) {
  const ok = await get({
    key: 'userview',
    conditions: {
      views_id: view,
      users_id: user,
    },
  })

  return ok.length > 0
}

const isAdmin = async function (user) {
  const ok = await get({
    key: 'user',
    conditions: {
      users_id: user,
      users_admin: 1,
    },
  })

  return ok.length > 0
}

const getData = async function (key, id, view) {
  const data = await get({
    key: key,
    id: id,
    view: view,
  })

  return data
}

const renderView = async function (type, id, templatePath) {
  const template = await fs.readFile(path.join(templatePath), 'utf-8')

  const data = await getData('view', id, type)

  if (data && data.length === 1) {
    const compiled = handlebars.compile(template)({
      view: type,
      data: data[0],
    })
    return {view: compiled, model: data[0]};
  } else return getError("view not found");
}

handlebars.registerHelper('isText', (field) => {
  return field.fieldtypes_id === 1
})
handlebars.registerHelper('isSelect', (field) => {
  return field.fieldtypes_id === 2
})
handlebars.registerHelper('isCheckbox', (field) => {
  return field.fieldtypes_id === 3
})
handlebars.registerHelper('isRadio', (field) => {
  return field.fieldtypes_id === 4
})
handlebars.registerHelper('styles', (view) => {
  const data = require('fs').readFileSync(
    path.join(__dirname, 'views', view, 'index.scss'),
    'utf-8'
  );
  
  const output = sass.renderSync({
    includePaths: [path.join(__dirname, 'views', 'base')],
    data: data,
  });

  return output.css.toString('utf-8');
})

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
)
app.use(bodyParser.json())

app.get('/:view/:type/scripts.js', (req, res) => {
  let sess = req.session

  async function build() {
    let filePath;
    
    if (!sess.user )
      filePath = path.join(__dirname, 'views', 'login', 'index.js')
    else
      await fs.access(path.join(__dirname, 'views', req.params.view, req.params.type, 'index.js')).then(() => {
        filePath = path.join(__dirname, 'views', req.params.view, req.params.type, 'index.js')
      }).catch(err => {
        filePath = path.join(__dirname, 'views', 'error', 'index.js')
      });

    const bundle = await rollup.rollup({
      input: filePath,
      plugins: [
        rollUpNodeResolve({
          browser: true,
          extensions: ['.js'],
        }),
        rollUpCommonjs(),
        rollUpBabel({
          exclude: 'node_modules/**',
        }),
      ],
    })

    const { output } = await bundle.generate({
      format: 'iife',
    })

    return output[0].code
  }

  build().then(
    (output) => {
      res.type('text/javascript')
      res.send(output)
    },
    (err) => {
      res.send(err)
    }
  )
})

app.get('/view/:type/:id', (req, res) => {
  if (req.xhr) {
    let sess = req.session
    if (!sess.user)
      getLogin(req.params.id).then(login => {        
        res.send(login);
      }).catch(async err => {
        const error = await getError(err)
        res.send(error);
      })
    else
      hasViewPermission(req.params.id, sess.user).then(
        async function (ok) {
          if (!ok) 
            getError('insufficient access').then(error => {
              res.send(error);
            });
          else
            await renderView(
              req.params.type,
              req.params.id,
              path.join(__dirname, 'views', 'view', req.params.type, 'index.html')
            ).then(response => {
              res.send(response);
            }).catch(err => {
              getError(err).then(error => {
                res.send(error);
              });
            })
        },
        err => {
          getError(err).then(error => {
            res.send(error);
          });
        }
      ).catch(err => {
        getError(err).then(error => {
          res.send(error);
        });
      })
  } else {
    res.sendFile(path.join(__dirname, 'index.html'))
  }
})

app.get('/edit/:type/:id', (req, res) => {
  if (req.xhr) {
    let sess = req.session
    if (!sess.user)
      getLogin(req.params.id).then(login => {        
        res.send(login);
      }).catch(async err => {
        const error = await getError(err)
        res.send(error);
      })
    else
      isAdmin(sess.user).then(
        async function (ok) {
          if (!ok) 
            getError('insufficient access').then(error => {
              res.send(error);
            });
          else
            await renderView(
              req.params.type,
              req.params.id,
              path.join(__dirname, 'views', 'edit', req.params.type, 'index.html')
            ).then(response => {
              res.send(response);
            }).catch(err => {
              getError(err).then(error => {
                res.send(error);
              });
            })
        },
        err => {
          getError(err).then(error => {
            res.send(error);
          });
        }
      )
  } else {
    res.sendFile(path.join(__dirname, 'index.html'))
  }
})

app.post('/login', (req, res) => {
  let sess = req.session

  get({
    key: 'user',
    view: 'login',
    conditions: {
      users_name: req.body.user,
    },
  }).then(
    (data) => {
      let result = {
        status: 'access denied',
      }

      if (data.length !== 1) result.status = 'invalid user'
      else {
        sess.user = data[0].users_id

        if (req.body.view)
          data[0].userviews.forEach((userview) => {
            if (userview.views_id === parseInt(req.body.view)) {
              result.status = 'ok'
            }
          })
      }
      res.send(result)
    },
    (err) => {
      console.log(err)
    }
  )
})

app.listen(8000)
