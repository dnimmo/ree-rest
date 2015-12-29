import express from 'express'
import {config} from './setup/config'
import posts from './endpoints/posts/'
import users from './endpoints/users/'
import auth from './endpoints/auth/'
import bodyParser from 'body-parser'
const thinky = require('thinky')();

const app = express();
const api = express.Router();

app.use(bodyParser.urlencoded({ extended: false })).use(bodyParser.json());

posts.init();
users.init();
auth.init();

app.use('/api/', config.api);


app.listen(4000, () => {
  console.log('listening');
});
