'use strict';

import {configure} from '../utils'
const express = require('express');
import eJwt from 'express-jwt';
import {slugify} from '../utils'
import keys from '../../secrets.json'

export let config = configure({
  api: express.Router(),
  db:  require('thinky')()
})


const addContent = function(req,res,next,content){
  if(req.method !== "POST"){
    let data = Object.assign(content, req.body);
  }else{
    let data = new this.db(content);
  }

  data.saveAll()
  .then((result) => {
    return res.send({"message": `document added to ${this.db.getTableName()}`});
  })
  .error((error) => {
    res.json({"message": error.toString()});
  });

}


export const getData = (args) => {
  const state = args
  return {
    all(){
      return state.model.run();
    },
    single(slug){
      return state.model.filter({slug: slug})
    }
  }
}

const resource = (state) => ({
    get(req,res,next) {
      getData(state).all().then((results) => {
        res.json(results);
      })
    },
    getSingle: (req,res,next) => {
      getData(state).single(req.params.slug)
      .then((results) => {
        res.json(results[0]);
      })
    },
    post: (req,res,next) => {
      let slug = slugify(req.body.title);
      getData(state).single(slug)
      .then((results) =>{
        if(results.length === 0){
          addContent(req,res,next,req.body);
        }else{
          res.json({'message': 'This item already exists'})
        }
      });
    },
    put: (req,res,next) => {
      getData(state).single(req.params.slug)
      .then((results) => {
        if(results.length !== 0){
          addContent(req,res,next,results[0])
        }else{
          res.json({'message': 'There is no document with this slug'})
        }
      })
    },
    delete: (req,res,next) => {
      getData(state).single(req.params.slug)
      .delete()
      .then((results) => res.json({'message': 'item deleted'}))
    }
})


const secureRoute = function(secure){
  if(secure){
    return eJwt({secret: keys.jwtkey})
  }else{
    return (req, res, next) => next()
  }
}

export const registerRoute = function(config, routes){
  const routess = Object.keys(routes)
  routess.map((item) => {
    let route = routes[item]

    config.api.get(
      `/${route.route}`,
      secureRoute(route.secure.get),
      route.get
    )

    config.api.get(
      `/${route.route}/:slug`,
      secureRoute(route.secure.get),
      route.getSingle
    )

    config.api.put(
      `/${route.route}/:slug`,
      secureRoute(route.secure.put),
      route.put
    )

    config.api.delete(
      `/${route.route}/:slug`,
      secureRoute(route.secure.delete),
      route.delete
    )

    config.api.post(
      `/${route.route}/`,
      secureRoute(route.secure.post),
      route.post)
  })
}

export const createRoute = function(args){
  const state = {
    route: args.route,
    model: args.model,
    secure: {
      get: args.secure.get || false,
      post: args.secure.post || true,
      put: args.secure.put || true,
      delete: args.secure.delete || true,
    }
  }
  return Object.assign(
    state,
    resource(state)
  )
}
