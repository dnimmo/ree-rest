import eJwt from 'express-jwt'
import * as basicRoutes from './basicRoutes'
//import {slugify} from '../../utils'
//import keys from '../../secrets.json'

import multer from 'multer'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './dev/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })



/*
  Assigns methods to the Express router
  router[i.methods[m].method](`/${i.route}${i.methods[m].params || ''}`,  i.methods[m].action)
  is the same as writing
  router.get(`/someRoute/:slug`, someFunction)

  but it is adapted to what is created by the resource function
*/
export const registerRoutes = function(router, routes) {
  routes.map((i) => {
    let methods = Object.keys(i.methods)
    methods.map((m) => {
      //appends route action to the api router
      router[i.methods[m].method](
        `/${i.route}${i.methods[m].params || ''}`,
        i.methods[m].action
      )
    })
  })
}


/*
  This returns RESTful endpoints for routecreated with createRoute function
  will only return specific method if allowedMethods has been passed
*/
const resource = (state) => {
  let resources = Object.assign(
    {},
    {
      get: {
        method: 'get',
        protected: false,
        action: basicRoutes.get(state)
      },
      getSingle: {
        method: 'get',
        params: '/:slug',
        protected: false,
        action: basicRoutes.getSingle
      },
      post: {
        method: 'post',
        protected: true,
        action: basicRoutes.post
      },
      put: {
        method: 'get',
        protected: true,
        params: '/:slug',
        action: basicRoutes.put
      },
      delete: {
        method: 'get',
        protected: true,
        params: '/:slug',
        action: basicRoutes.del
      }
    }
  )
  if(state.allowedMethods.length === 0) return resources

  const methods = {}
  state.allowedMethods.map((item) => methods[item.toLowerCase()] = resources[item.toLowerCase()])

  return methods
}

/*
  Use this function to create a route
  example:
    createRoute({
      route: 'posts',
      model: Posts
    })
  this will create a route for 'posts' that has all the endpoints.

  allowedMethods is an array of specific endpoints if you want specific routes
  example:
    createRoute({
      route: 'posts',
      model: Posts,
      allowedMethods: ['get']
    })

  will only return a get method on this route
*/
export const createRoute = function(args){
  const state = {
    route: args.route,
    model: args.model,
    allowedMethods: args.allowedMethods || []
  }
  return Object.assign(
    state,
    args,
    {methods: resource(state)}
  )
}
