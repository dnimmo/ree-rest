import basicRoute from '../../setup/basicRoute.js'
import {Schema, Users} from '../users/model.js'
import {config} from '../../setup/config.js'
import bcrypt from 'bcrypt-as-promised'
import keys from '../../../secrets.json'
import jwt from 'jsonwebtoken'

let auth = {
  route: 'auth',
  db: Users,
  api: config.api
}

auth.authenticate = function(req,res,next) {
  let email = req.body.email;
  this.db.filter({email: email })
  .then((results) => {
    if(results.length === 0){
      return res.json({"message": "no user found"})
    }else{
      bcrypt.compare(req.body.password, results[0].password)
      .then(() => {
        let payload = {
          email: results[0].email
        }
        return res.json(jwt.sign(payload, keys.jwtkey, {expiresIn: '1d'}));
      })
      .catch(bcrypt.MISMATCH_ERROR, (error) => {
        return res.json(error);
      });
    }
  })
}

auth.init = function(req,res,next) {
  this.api.post(`/${this.route}`, this.authenticate.bind(this));
}

export default auth;
