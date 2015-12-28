import basicRoute from '../../setup/basicRoute.js';
import {Schema, Posts} from './model.js';
import {config} from '../../setup/config.js';

var posts = Object.create(basicRoute);
posts = Object.assign(posts, {route: 'posts', db: Posts}, config);

export default posts;
