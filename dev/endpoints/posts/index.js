import {Schema, Posts} from './model.js';
import {createRoute} from '../../setup/routing';
import {config} from '../../setup/config';

const posts = createRoute({
  route:'posts',
  model: Posts
})

export default posts;
