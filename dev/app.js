import express from 'express'
import {config, registerRoute} from './setup/config'
import posts from './endpoints/posts'
import bodyParser from 'body-parser'

const app = express();

app.use(bodyParser.urlencoded({ extended: false })).use(bodyParser.json());

console.log(registerRoute)

registerRoute(config, {
  posts
})


app.use('/api/', config.api);


app.listen(4000, () => {
  console.log('listening');
});
