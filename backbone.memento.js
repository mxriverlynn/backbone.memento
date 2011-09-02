// Backbone.Memento v0.1.3
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT Liscene
//
// Documentation and Full Licence Availabe at:
// http://github.com/derickbailey/backbone.memento

// ----------------------------
// Backbone.Memento
// ----------------------------
Backbone.Memento = function(model){
  this.version = "0.1.3";

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
      var attrs = attributeStack[last];

      //handle removing attributes that were added
      var removedAttrs = getRemovedAttrDiff(attrs, model.toJSON());
      removeAttributes(model, removedAttrs);

      //restore the previous state
      model.set(attrs);

      //destroy the no-longer-current state
      delete attributeStack[last];
  }

  function initialize(){
    attributeStack = new Array();
  }

  this.push = function(){
    attributeStack.push(model.toJSON());
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
