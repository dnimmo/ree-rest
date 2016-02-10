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
