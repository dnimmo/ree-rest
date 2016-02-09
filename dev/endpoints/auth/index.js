import basicRoute from '../../setup/basicRoute.js'
import {Schema, Users} from '../users/model.js'
import bcrypt from 'bcrypt-as-promised'
import keys from '../../../secrets.json'
import jwt from 'jsonwebtoken'

import {config, createRoute, addContent, getData} from '../../setup/config.js';


const login = createRoute({
  route:'login',
  model: Users,
  secure: {
    post: false
  }
})

login.post = (req,res,next) => {
  let email = req.body.email;

  Users.filter({email: email })
  .then((results) => {
    console.log('e')
    if(results.length === 0){
      return res.json({"message": "no user found"})
    }else{

      bcrypt.compare(req.body.password, results[0].password)
      .then(() => {
        let payload = {
          email: results[0].email
        }
        return res.json({token: jwt.sign(payload, keys.jwtkey, {expiresIn: '1d'})});
      })
      .catch(bcrypt.MISMATCH_ERROR, (error) => {
        return res.json(error);
      });

    }
  })
}

login.removeMethods(['GET','DELETE','PUT'])

export default login
