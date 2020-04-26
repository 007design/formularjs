(() => {
    window.init = (model, view) => {
      document.querySelector('main').innerHTML = view;
      document.title = model.views_name;
    };
})();