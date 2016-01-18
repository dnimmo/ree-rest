import basicRoute from '../../setup/basicRoute.js'
import {Schema, Products} from '../products/model.js'
import {config, thinky} from '../../setup/config.js'
import bcrypt from 'bcrypt-as-promised'
import keys from '../../../secrets.json'
import jwt from 'jsonwebtoken'

let cart = {
  route: 'cart',
  db: Products,
  api: config.api
}

var r  = thinky.r;

cart.validateCart = function(req,res,next,cart, items){
  var total = 0;
  items.some((items) => total+= items.price);

  if(cart.total_price === total){
    // chargefunction
    res.send('happy days');
  }else{
    res.json({'message': 'there was an issue with processing your order'});
  }
}

cart.checkout = function(req, res, next) {
  var body = req.body;

  var products = body.items.map((item) => item.title);

  this.db.filter((item) => {
     return r(products).contains(item("slug"))
   }).then((results) => {
    console.log(results);
    this.validateCart(req,res,next,body,results);
  });

}

cart.init = function(req,res,next) {
  this.api.post(`/checkout`, this.checkout.bind(this));
}

export default cart;
