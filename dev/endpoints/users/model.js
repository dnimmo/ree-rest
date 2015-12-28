import {slugify} from '../../utils'
import {thinky} from '../../setup/config.js'

let type = thinky.type;

export let Schema = {
  id: type.string(),
  username: type.string().min(2),
  slug: type.string().min(2),
  password: type.string().min(8),
  email: type.string().email(),
  created_at: Date,
  modified_at: Date
}

export let Users = thinky.createModel("Users", Schema);

Users.ensureIndex("slug");

Users.pre('save', function(next) {
  this.slug = slugify(this.username);
  console.log(this);
  try{
    this.validate({enforce_extra: 'strict'});
  }catch(err){
    return next(new Error(err));
  }
  next();
});
