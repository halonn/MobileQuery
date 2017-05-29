
function makeDocumentFragment(htmlText) {
  var range = document.createRange();
  return range.createContextualFragment(htmlText);

}
var mappers = [{
  name: "Model",
  selector: '[itemprop="name"]'
}, {
  name: "LTE",
  selector: ':contains("Standard LTE")',
  map: function(element) {
    return element != null;
  }
}, {
  name: "Bateria",
  selector: '',
  map: function(elem) {
    return parseInt(elem.textContent);
  }
}]

function applyMappers(fragment, mappers) {
  return mappers.forEach(function(mapper) {
    var res = fragment.querySelectorAll(mapper.selector);
    if (mapper.map)
      res = mapper.map(res);
    else if (res)
      res = res.textContent;
    return {
      name: mapper.name,
      res: res
    };
  }).reduce(function(m, res) {
    res[m.name] = m.res;
  }, {});
}

function getDetails(url) {
  fetch(url)
    .then(function(response) {
      return response.text();
    })
    .then(function(t) {
      return makeDocumentFragment(t)
    })
    .then(function(fragment) {
      return applyMappers(fragment);
    })
    .then(function(t) {
      document.body.textContent += JSON.stringify(t);
    })
    .catch(function(err) {
      alert(err);
    });
}