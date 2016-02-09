import {slugify} from '../../utils';
import {config} from '../../setup/config.js';

let type = config.db.type;


export let Schema = {
  id: type.string(),
  title: type.string().min(2),
  file: type.string().min(2),
  slug: type.string().min(2),
  type: type.string().min(2),
  alt: type.string().min(2),
  created_at: Date,
  modified_at: Date
}

export let Media = config.db.createModel("Media", Schema);

Media.ensureIndex("slug");

Media.pre('save', function(next) {
  this.slug = slugify(this.title);
  console.log(this);
  try{
    this.validate({enforce_extra: 'strict'});
  }catch(err){
    return next(new Error(err));
  }

  next();
});
