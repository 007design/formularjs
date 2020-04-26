import * as handlebars from '../../node_modules/handlebars/dist/handlebars.min.js';
window.Handlebars = handlebars.default;

window.init = function(model, view) {
  document.title = "Edit Form"
  const template = window.Handlebars.compile(view)
  document.querySelector('main').innerHTML = template(model);
}
