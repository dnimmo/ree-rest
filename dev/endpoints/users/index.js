import basicRoute from '../../setup/basicRoute.js';
import {Schema, Users} from './model.js';
import {config} from '../../setup/config.js';
import {slugify} from '../../utils';
import eJwt from 'express-jwt';
import bcrypt from 'bcrypt-as-promised';
import keys from '../../../secrets.json'

var users = Object.create(basicRoute);
users = Object.assign(users, {route: 'users', db: Users}, config);




users.addContentWithPass = function(req,res,next,content){
  var data = new this.db(content);
  var that = this;

  bcrypt.hash(data.password, 10)
  .then((hash) => data.password = hash)
  .then(() => {
    this.addContent(req,res,next,data);
  });

}


users.post = function(req,res,next) {
  let body = req.body;
  let slug = slugify(body.username);

  this.db.filter((item) => {
     return item("slug").eq(slug).or(item('email').eq(body.email));
   }).then((results) =>{
    if(results.length === 0){
      this.addContentWithPass(req,res,next,req.body);
    }else{
      res.json({'message': 'This item already exists'});
    }
  });
}


users.init = function(req,res,next){
  this.api.get(`/${this.route}`,eJwt({secret: keys.jwtkey}), this.get.bind(this));
  this.api.get(`/${this.route}/:slug`,eJwt({secret: keys.jwtkey}), this.getItem.bind(this));
  this.api.post(`/${this.route}`, this.post.bind(this));
  this.api.put(`/${this.route}/:slug`,eJwt({secret: keys.jwtkey}), this.put.bind(this));
}

export default users;
