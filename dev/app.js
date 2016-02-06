import express from 'express'
import {config} from './setup/config'
import {Posts} from './endpoints/posts/model'
import bodyParser from 'body-parser'

const app = express();

app.use(bodyParser.urlencoded({ extended: false })).use(bodyParser.json());



registerRoute(config, {
  posts
})


app.use('/api/', config.api);


app.listen(4000, () => {
  console.log('listening');
});
