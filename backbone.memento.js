Backbone.Memento = (function(model){
  var attributeStack = {};

  function getRemovedAttrDiff(newAttrs, oldAttrs){
    var removedAttrs = [];

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
      attr = removedAttrs[index];
      model.unset(attr);
    }
  }
  
  return {
    version: "0.1.0",

    push: function(){
      var count = Object.keys(attributeStack).length;
      attributeStack[count] = model.toJSON();
    },
    
    pop: function(){
      var last = Object.keys(attributeStack).length-1;
      if (last < 0)
        return null;

      //get the previous state
      attrs = attributeStack[last];

      //handle removing attributes that were added
      removedAttrs = getRemovedAttrDiff(attrs, model.toJSON());
      removeAttributes(model, removedAttrs);

      //restore the previous state
      model.set(attrs);

      //destroy the no-longer-current state
      delete attributeStack[last];
    }
  }
});
