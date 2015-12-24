'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _test = require('./test/test.js');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var thinky = require('thinky')();
var app = (0, _express2.default)();

var type = thinky.type;

var Post = thinky.createModel("Post", {
  id: String,
  title: String,
  content: String
});

console.log(Post);

app.get('/', function (req, res, next) {
  res.send(_test2.default);
});

app.post('/', function (req, res, next) {
  var body = {
    title: "hello",
    content: "more hellos",
    something: "hello"
  };

  var post = new Post(body);

  post.saveAll().then(function (result) {
    console.log(result);
  });
});

// Create a model - the table is automatically created

app.listen(4000, function () {
  console.log('listening');
});