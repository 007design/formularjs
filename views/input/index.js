(() => {
  window.init = (model, view) => {
    document.querySelector('main').innerHTML = view;
    document.title = model.views_name;

    model.viewfields.forEach(viewField => {
      const fieldElement = document.getElementById('field_'+viewField.viewfields_id);
      if (!fieldElement) return;

      if (viewField.viewfields_required)
        fieldElement.style.backgroundColor = 'red'
    });

    document.querySelectorAll('input[type="text"]').forEach(field => {});
  }
})();