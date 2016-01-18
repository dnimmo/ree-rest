import basicRoute from '../../setup/basicRoute.js';
import {Schema, Media} from './model.js';
import {config, thinky} from '../../setup/config.js';
import eJwt from 'express-jwt';
import keys from '../../../secrets.json'
import multer from 'multer'
import fs from 'fs'
import {slugify} from '../../utils';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './dev/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })


var media = Object.create(basicRoute);
media = Object.assign(media, {route: 'media', db: Media}, config);

let r  = thinky.r;


media.addMedia = function(req,res,next,content){

  var newItems = [];

  content.map((item) => {
    var newItem = {};
    newItem['title'] = item.originalname;
    newItem['slug'] = slugify(item.originalname);
    newItem['type'] = item.mimetype;
    newItem['file'] = item.filename;

    newItems.push(newItem);
  });

  console.log(newItems);

  this.db.save(newItems).then((result) => {

    return res.send({"message": `document added to ${this.db.getTableName()}`});
  }).error((error) => {
    var error = error.toString();
    res.json({"message": error});
  });
}

media.getTest = function(req,res,next) {


  let slug = req.files.map((item) => slugify(item.originalname));
  console.log(slug);
  this.db.filter((item) => {
     return r(slug).contains(item("slug"))
   }).then((results) => {
    if(results.length === 0){
      this.addMedia(req,res,next, req.files)
    }else{
      res.json({'message': 'This item already exists'})
    }
  });
}

media.post = function(req,res,next) {


  let slug = req.files.map((item) => slugify(item.originalname));
  console.log(slug);
  this.db.filter((item) => {
     return r(slug).contains(item("slug"))
   }).then((results) => {
    if(results.length === 0){
      this.addMedia(req,res,next, req.files)
    }else{
      res.json({'message': 'This item already exists'})
    }
  });
}

media.delete = function(req,res,next) {
  let slug = req.params.slug;
  this.db.filter({slug: slug}).then((results) => {
    if(results.length !== 0){
      fs.unlink(__dirname+'/../../uploads/'+results[0].file, (err) => {
        if (err) throw err;
        results[0].delete()
        return res.json({'message': 'This item has been deleted'})
      });
    }else{
      res.json({'message': 'This item already exists'})
    }
  });
}

media.init = function(req,res,next){
  this.api.get(`/${this.route}`,eJwt({secret: keys.jwtkey}), this.get.bind(this));
  this.api.get(`/${this.route}/:slug`,eJwt({secret: keys.jwtkey}), this.getItem.bind(this));
  this.api.post(`/${this.route}`,eJwt({secret: keys.jwtkey}), upload.array('file'), this.post.bind(this));
  this.api.put(`/${this.route}/:slug`,eJwt({secret: keys.jwtkey}), this.put.bind(this));
  this.api.delete(`/${this.route}/:slug`,eJwt({secret: keys.jwtkey}), this.delete.bind(this));
}



export default media;
