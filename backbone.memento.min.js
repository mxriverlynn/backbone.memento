// Backbone.Memento v0.4.1a
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT Liscene
//
// Documentation and Full License Availabe at:
// http://github.com/derickbailey/backbone.memento

// ----------------------------
// Backbone.Memento
// ----------------------------
Backbone.Memento=function(h,i){var m=function(b){b instanceof h.Model?(this.removeAttr=function(a){b.unset(a)},this.restore=function(a){b.set(a)}):(this.removeAttr=function(a){b.remove(a)},this.restore=function(a){b.reset(a)})},n=function(b,a){function d(a,b){a=i.clone(a);if(b.hasOwnProperty("ignore")&&b.ignore.length>0)for(var c in b.ignore)delete a[b.ignore[c]];return a}var f=new m(b);this.serialize=function(){var g=b.toJSON();return g=d(g,a)};this.deserialize=function(g,l){var c=l=i.extend({},
a,l),j=d(g,c),e=b.toJSON(),e=d(e,c);c=e;e=[];if(j&&c)for(var k in c)c.hasOwnProperty(k)&&(j.hasOwnProperty(k)||e.push(k));for(var h in e)f.removeAttr(e[h]);f.restore(j)}},o=function(){var b;this.push=function(a){b.push(a)};this.pop=function(){return b.pop()};this.rewind=function(){var a=b[0];b=[];return a};b=[]};return function(b,a){this.version="0.4.1";var a=i.extend({ignore:[]},a),d=new n(b,a),f=new o(b,a);this.store=function(){var a=d.serialize();f.push(a)};this.restore=function(a){var b=f.pop();
b&&d.deserialize(b,a)};this.restart=function(a){var b=f.rewind();b&&d.deserialize(b,a)}}}(Backbone,_);
