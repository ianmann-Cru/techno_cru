/**
Returns a key-value pair of the form input for a given html form.
*/
function serializeForm(form) {
  // Found in the 3rd answer on
  // https://stackoverflow.com/questions/2276463/how-can-i-get-form-data-with-javascript-jquery
  return form.serializeArray().reduce(function(obj, item) {
      obj[item.name] = item.value;
      return obj;
  }, {});
}

/**
Returns the cookie with the given name
*/
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
Returns the value of the csrf token as a string.
*/
function getCsrfToken() {
  return getCookie("csrftoken");
}
