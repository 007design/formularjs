(() => {
  window.init = (model, view) => {
    document.querySelector('main').innerHTML = view;
    document.title = model.views_name;

    const form = document.getElementById("login_form");
    form.addEventListener('submit', e => {
      e.preventDefault();

      const request = new XMLHttpRequest();

      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          if (request.status === 200) {
            const resp = JSON.parse(request.response);
            window.location.reload();
          }
        }
      };

      request.open('POST', "/login?rand="+(new Date()).getTime(), true);
      request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      request.setRequestHeader('Accept', 'application/json');
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(JSON.stringify({
        user: form.user.value,
        pass: form.pass.value,
        view: form.view.value
      }));
    });
  }
})();