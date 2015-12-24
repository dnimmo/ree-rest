import express from 'express'
import config from './setup/config'
import posts from './endpoints/posts/'
import bodyParser from 'body-parser'


const app = express();
const api = express.Router();

app.use(bodyParser.urlencoded({ extended: false })).use(bodyParser.json());

posts.init();

app.use('/api/', config.api);


app.listen(4000, () => {
  console.log('listening');
});
