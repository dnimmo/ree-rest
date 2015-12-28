import basicRoute from '../../setup/basicRoute.js';
import {Schema, Users} from './model.js';
import {config} from '../../setup/config.js';

var users = Object.create(basicRoute);
users = Object.assign(users, {route: 'users', db: Users}, config);

export default users;
