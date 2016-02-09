import {Schema, Media} from './model.js';
import fs from 'fs'
import {slugify} from '../../utils';
import {config, createRoute} from '../../setup/config.js';



const media = createRoute({
  route:'media',
  model: Media,
  secure: {
    get: true,
    post: true,
    put: true,
    delete: true
  }
})

let r  = config.db.r;

const addMedia = function(req,res,next,content){

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

  Media.save(newItems).then((result) => {

    return res.send({"message": `document added to ${Media.getTableName()}`});
  }).error((error) => {
    var error = error.toString();
    res.json({"message": error});
  });
}

media.filePost = function(req,res,next) {
  let slug = req.files.map((item) => slugify(item.originalname));
  Media.filter((item) => {
     return r(slug).contains(item("slug"))
   }).then((results) => {
    if(results.length === 0){
      addMedia(req,res,next, req.files)
    }else{
      res.json({'message': 'This item already exists'})
    }
  });
}

media.delete = function(req,res,next) {
  let slug = req.params.slug;
  Media.filter({slug: slug}).then((results) => {
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

media.removeMethods(['PUT','POST'])

export default media;
