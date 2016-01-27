import {slugify} from '../../utils';
import {thinky} from '../../setup/config.js';

let type = thinky.type;


export let Schema = { 
  id: type.string(),
  title: type.string().min(2),
  slug: type.string().min(2),
  price: type.number(),
  sale_price: type.number(),
  weight: type.number(),
  variations: [type.string()],
  featured_images: [type.string()],
  featured: type.string().min(2),
  digital: Boolean,
  links: [type.string()],
  digital_file: type.string().min(2),
  tracks: [type.string()],
  type: type.string().min(2),
  release_date : Date,
  created_at: Date,
  modified_at: Date
}

export let Products = thinky.createModel("Products", Schema);

Products.ensureIndex("slug");

Products.pre('save', function(next) {
  this.slug = slugify(this.title);
  console.log(this);
  try{
    this.validate({enforce_extra: 'strict'});
  }catch(err){
    return next(new Error(err));
  }

  next();
});
