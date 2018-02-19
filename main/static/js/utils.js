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
