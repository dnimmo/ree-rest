import {slugify} from '../utils'
import eJwt from 'express-jwt';
import keys from '../../secrets.json'

let basicRoute = {
  route: null,
  api: null,
  db: null,
  get(req,res,next){
    this.db.run((err, results) =>{
      res.json(results); 
    });
  },
  addContent(req,res,next,content){
    if(req.method !== "POST"){
      var data = Object.assign(content, req.body);
    }else{
      var data = new this.db(content);
    }

    data.saveAll().then((result) => {
      console.log("hello");
      return res.send({"message": `document added to ${this.db.getTableName()}`});
    }).error((error) => {
      var error = error.toString();
      res.json({"message": error});
    });
  },
  post(req,res,next){
    let slug = slugify(req.body.title);
    this.db.filter({slug: slug}).then((results) =>{
      if(results.length === 0){
        this.addContent(req,res,next,req.body);
      }else{
        res.json({'message': 'This item already exists'})
      }
    });
  },
  put(req,res,next){
    this.db.filter({slug: req.params.slug}).then((results) =>{
      if(results.length !== 0){
        this.addContent(req,res,next,results[0])
      }else{
        res.json({'message': 'There is no document with this slug'})
      }
    });
  },
  getItem(req,res,next){
    var data = new this.db(req.body);
    this.db.filter({slug: req.params.slug}).then((results) =>{
      return res.json(results[0]);
    });
  },
  init(){
    this.api.get(`/${this.route}`, this.get.bind(this));
    this.api.get(`/${this.route}/:slug`, this.getItem.bind(this));
    this.api.post(`/${this.route}`,eJwt({secret: keys.jwtkey}), this.post.bind(this));
    this.api.put(`/${this.route}/:slug`,eJwt({secret: keys.jwtkey}), this.put.bind(this));
  }
}

export default basicRoute;
