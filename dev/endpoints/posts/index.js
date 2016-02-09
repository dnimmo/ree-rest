import {Schema, Posts} from './model.js';
import {config, createRoute} from '../../setup/config.js';

const posts = createRoute({
  route:'posts',
  model: Posts,
})

export default posts;
