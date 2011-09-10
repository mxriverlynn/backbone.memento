AModel = Backbone.Model.extend({
  initialize: function(){
    var memento = new Backbone.Memento(this);
    this.store = memento.push;
    this.restore = memento.pop;
    this.clear = memento.clear;
  }
});

IgnoredAttrsModel = Backbone.Model.extend({
  initialize: function(){
    var memento = new Backbone.Memento(this, {
      ignore: ["ignoreMe"]
    });
    this.store = memento.push;
    this.restore = memento.pop;
    this.clear = memento.clear;
  }
});
