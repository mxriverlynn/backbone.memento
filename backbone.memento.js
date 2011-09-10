// Backbone.Memento v0.2.0
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
  this.version = "0.2.0";

  config = _.extend({
    ignore: []
  }, config);

  var attributeStack;

  function getAddedAttrDiff(newAttrs, oldAttrs){
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

  function restoreState(last, restoreConfig){
    //get the previous state
    var oldAttrs = attributeStack[last];
    if (oldAttrs === undefined){ return; }
    oldAttrs = dropIgnored(oldAttrs, restoreConfig);

    //get the current state
    var currentAttrs = model.toJSON();
    currentAttrs = dropIgnored(currentAttrs, restoreConfig);

    //handle removing attributes that were added
    var removedAttrs = getAddedAttrDiff(oldAttrs, currentAttrs);
    removeAttributes(model, removedAttrs);

    //restore the previous state
    model.set(oldAttrs);

    //destroy the no-longer-current state
    delete attributeStack[last];
  }

  function dropIgnored(attrs, restoreConfig){
    attrs = _.clone(attrs);
    if (restoreConfig.hasOwnProperty("ignore") && restoreConfig.ignore.length > 0){
      for(var index in restoreConfig.ignore){
        var ignore = restoreConfig.ignore[index];
        delete attrs[ignore];
      }
    }
    return attrs;
  }

  function initialize(){
    attributeStack = new Array();
  }

  this.store = function(){
    var attrs = model.toJSON();
    attrs = dropIgnored(attrs, config);
    attributeStack.push(attrs);
  }
  
  this.restore = function(restoreConfig){
    if (restoreConfig === undefined){
      restoreConfig = _.clone(config);
    }

    var last = attributeStack.length-1;
    if (last < 0) {
      return null;
    }

    restoreState(last, restoreConfig);
  }

  this.reset = function(){
    if(attributeStack.length === 0){
      return null;
    }
    restoreState(0, config);
    // restoreState deleted item 0, but really 
    // we should be starting from scratch.
    initialize();
  }

  initialize();
};
