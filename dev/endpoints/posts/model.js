import {slugify} from '../../utils';
import {config} from '../../setup/config'

let thinky = config.db
let type = thinky.type;


export let Schema = {
  id: type.string(),
  title: type.string().min(2),
  slug: type.string().min(2),
  content: type.string().min(2),
  featured_image: type.string().min(2),
  created_at: Date,
  modified_at: Date
}

export let Posts = thinky.createModel("Post", Schema);

Posts.ensureIndex("slug");

Posts.pre('save', function(next) {
  this.slug = slugify(this.title);
  console.log(this);
  try{
    this.validate({enforce_extra: 'strict'});
  }catch(err){
    return next(new Error(err));
  }

  next();
});
