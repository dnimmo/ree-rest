import basicRoute from '../../setup/basicRoute.js';
import {Schema, Users} from './model.js';
import {slugify} from '../../utils';
import eJwt from 'express-jwt';
import bcrypt from 'bcrypt-as-promised';
import keys from '../../../secrets.json'

import {config, createRoute, addContent, getData} from '../../setup/config.js';

const users = createRoute({
  route:'users',
  model: Users,
  secure: {
    get: true,
    post: true,
    put: true,
    delete: true
  }
})

users.post = (req,res,next) => {
  let body = req.body
  let slug = slugify(body.username)

  getData({model: Users}).single({email: body.email}).then((results) =>{
    
    if(results.length === 0){
      bcrypt.hash(body.password, 10)
      .then((hash) => body = hash)
      .then((hash) => {
        addContent({
          content: data,
          model: Users
        },req,res,next)
      });

    }else{
      res.json({'message': 'This item already exists'});
    }
  });
}

export default users;
