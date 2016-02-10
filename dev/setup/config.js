'use strict';

import {configure} from '../utils'
const express = require('express')


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
