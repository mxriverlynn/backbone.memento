// Backbone.Memento v0.1.4
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT Liscene
//
// Documentation and Full Licence Availabe at:
// http://github.com/derickbailey/backbone.memento

// ----------------------------
// Backbone.Memento
// ----------------------------
Backbone.Memento = function(model, config){
  this.version = "0.1.4";

  config = _.extend({
    ignore: []
  }, config);

  var attributeStack;

  function getRemovedAttrDiff(newAttrs, oldAttrs){
    var removedAttrs = [];

    // guard clause to ensure we have attrs to compare
    if (!newAttrs || !oldAttrs){
      return removedAttrs;
    }

    // if the attr is found in the old set but not in
    // the new set, then it was remove in the new set
    for (var attr in oldAttrs){
      if (oldAttrs.hasOwnProperty(attr)){
        if (!newAttrs.hasOwnProperty(attr)){
          removedAttrs.push(attr);
        }
      }
    }

    return removedAttrs;
  }

  function removeAttributes(model, attrsToRemove){
    for (var index in attrsToRemove){
      var attr = attrsToRemove[index];
      model.unset(attr);
    }
  }

  function restoreState(last){
    //get the previous state
    var oldAttrs = attributeStack[last];
    var currentAttrs = dropIgnored(model.toJSON());

    //handle removing attributes that were added
    var removedAttrs = getRemovedAttrDiff(oldAttrs, currentAttrs);
    removeAttributes(model, removedAttrs);

    //restore the previous state
    model.set(oldAttrs);

    //destroy the no-longer-current state
    delete attributeStack[last];
  }

  function dropIgnored(attrs){
    attrs = _.clone(attrs);
    if (config.hasOwnProperty("ignore") && config.ignore.length > 0){
      for(var index in config.ignore){
        var ignore = config.ignore[index];
        delete attrs[ignore];
      }
    }
    return attrs;
  }

  function initialize(){
    attributeStack = new Array();
  }

  this.push = function(){
    var attrs = model.toJSON();
    attrs = dropIgnored(attrs);
    attributeStack.push(attrs);
  }
  
  this.pop = function(){
    var last = attributeStack.length-1;
    if (last < 0) {
      return null;
    }
    restoreState(last);
  }

  this.clear = function(){
    if(attributeStack.length === 0){
      return null;
    }
    restoreState(0);
    // restoreState deleted item 0, but really 
    // we should be starting from scratch.
    initialize();
  }

  initialize();
};
