'use strict';

import {configure} from '../utils'
const express = require('express')
import eJwt from 'express-jwt'
import {slugify} from '../utils'
import keys from '../../secrets.json'

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

export let config = configure({
  api: express.Router(),
  db:  require('thinky')()
})


export const addContent = function(args,req,res,next){
  const state = args
  console.log(state)
  if(req.method !== "POST"){
    var data = Object.assign(state.content, req.body);
  }else{
    var data = new state.model(state.content);
  }

  data.saveAll()
  .then((result) => {
    return res.send({"message": `document added to ${state.model.getTableName()}`});
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
    single(query){
      console.log(query)
      return state.model.filter(query)
    }
  }
}

const resource = (state) => ({
    get: (req,res,next) => {
      getData(state).all().then((results) => {
        res.json(results);
      })
    },
    getSingle: (req,res,next) => {
      getData(state).single({slug: req.params.slug})
      .then((results) => {
        res.json(results[0]);
      })
    },
    post: (req,res,next) => {
      let slug = slugify(req.body.title)
      getData(state).single({slug: slug})
      .then((results) =>{
        if(results.length === 0){
          addContent({
            model: state.model,
            content: req.body
          },req,res,next);
        }else{
          res.json({'message': 'This item already exists'})
        }
      });
    },
    put: (req,res,next) => {
      getData(state).single({slug: req.params.slug})
      .then((results) => {
        if(results.length !== 0){
          addContent({
            model: state.model,
            content: results[0]
          },req,res,next);
        }else{
          res.json({'message': 'There is no document with this slug'})
        }
      })
    },
    delete: (req,res,next) => {
      getData(state).single({slug: req.params.slug})
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

const removeMethods = (state) => ({
  removeMethods: (methods) => {
    methods.map((item) => {
      delete state[item.toLowerCase()]
    })
  }
})

export const resourceRoutes = function(config, routes){
  const routess = Object.keys(routes)
  routess.map((item) => {
    let route = routes[item]

    if(route.get !== undefined){
      config.api.get(
        `/${route.route}`,
        secureRoute(route.secure.get),
        route.get
      )
    }

    if(route.get !== undefined){
      config.api.get(
        `/${route.route}/:slug`,
        secureRoute(route.secure.get),
        route.getSingle
      )
    }

    if(route.put !== undefined){
      config.api.put(
        `/${route.route}/:slug`,
        secureRoute(route.secure.put),
        route.put
      )
    }

    if(route.delete !== undefined){
      config.api.delete(
        `/${route.route}/:slug`,
        secureRoute(route.secure.delete),
        route.delete
      )
    }

    if(route.post !== undefined){
      config.api.post(
        `/${route.route}/`,
        secureRoute(route.secure.post),
        route.post
      )
    }

    if(route.filePost !== undefined){
      config.api.post(
        `/${route.route}/`,
        secureRoute(route.secure.post),
        upload.array('file'),
        route.filePost
      )
    }


  })
}

export const createRoute = function(args){
  const state = {
    route: args.route,
    model: args.model,
    secure: {
      get: false,
      post: true,
      put: true,
      delete: true,
    }
  }
  return Object.assign(
    state,
    args,
    resource(state),
    removeMethods(state)
  )

}
