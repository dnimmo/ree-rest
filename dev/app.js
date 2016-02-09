import express from 'express'
import {config, resourceRoutes} from './setup/config'
import posts from './endpoints/posts'
import login from './endpoints/auth'
import media from './endpoints/media'
import users from './endpoints/users'
import bodyParser from 'body-parser'

const app = express();

app.use(bodyParser.urlencoded({ extended: false })).use(bodyParser.json());


resourceRoutes(config, {
  posts,
  users,
  media,
  login
})

config.api.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});

app.use('/api/', config.api);


app.listen(4000, () => {
  console.log('listening');
});
