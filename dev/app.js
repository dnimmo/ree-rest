import express from 'express'
import {config} from './setup/config'
import {registerRoutes} from './setup/routing'
import posts from './endpoints/posts'
import bodyParser from 'body-parser'

const app = express();

app.use(bodyParser.urlencoded({ extended: false })).use(bodyParser.json());


console.log(posts)

registerRoutes(config.api, [
  posts
])


config.api.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});

app.use('/api/', config.api);


app.listen(4000, () => {
  console.log('listening');
});
