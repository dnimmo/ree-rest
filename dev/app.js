import express from 'express'
import {config} from './setup/config'
import posts from './endpoints/posts/'
import users from './endpoints/users/'
import auth from './endpoints/auth/'
import media from './endpoints/media/'
import bodyParser from 'body-parser'

const app = express();
const api = express.Router();

app.use(bodyParser.urlencoded({limit:'60mb', extended: false })).use(bodyParser.json({limit:'60mb'}));

posts.init();
users.init();
media.init();
auth.init();

app.use('/api/', config.api);


app.listen(4000, () => {
  console.log('listening');
});
