AModel = Backbone.Model.extend({
  initialize: function(){
    this.memento = new Backbone.Memento(this);
  },

  store: function(){
    this.memento.push();
  },

  restore: function(){
    this.memento.pop();
  },

  clear: function(){
    this.memento.clear();
  }
});
