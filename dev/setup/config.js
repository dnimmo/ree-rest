'use strict';

import {configure} from '../utils'
const express = require('express');

export let config = configure({
  api: express.Router(),
  db:  require('thinky')()
})


const resource = (state) => ({
    get: (req,res,next) => {
      state.model.run((err, results) => {
        return res.json(results);
      });
    },
    getSingle: () => console.log('hello 1'),
    post: () => console.log('hello post'),
    put: () => console.log('hello put'),
    delete: () => console.log('hello delete')
})

export const registerRoute = function(config, routes){
  const routess = Object.keys(routes)
  routess.map((item) => {
    let route = routes[item]
    config.api.get(`/${route.route}`, route.get)
    config.api.get(`/${route.route}/:slug`, route.getSingle)
  })
}

export const createRoute = function(args){
  const state = {
    route: args.route,
    model: args.model
  }
  return Object.assign(
    state,
    resource(state)
  )
}
