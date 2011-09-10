# Backbone.Memento

Memento push and pop for [Backbone.js](http://documentcloud.github.com/backbone) models.

A view may offer some editing capabilities that directly modify a model, directly. If
you want to cancel the changes after they have already been applied to the model, you
will have to make a round trip to the back-end server or other origin of the model's
data to do so.

With the memento pattern and the Backbone.Memento plugin, you do not need to make
any round trips.

## Getting Started

It's easy to get up and running. You only need to have Backbone (including underscore.js - 
a requirement for Backbone) in your page before including the backbone.memento
plugin.

### Prerequisites

* Backbone.js v0.4 or higher

This plugin is built and tested against Backbone v0.5.1 but should run against most
versions of Backbone, as it only uses functionality built into the Backbone Models.
Namely, it uses the `set` and `unset` methods of models.

### Get The Memento Plugin

Download the `backbone.memento.js` file from this github repository and copy it into 
your javascripts folder. Add the needed `<script>` tag to bring the plugin into any page
that wishes to use it. Be sure to include the modelbinding file _after_ the backbone.js file.

### Setup A Model For Mementoing

Your models must make use of the Backbone.Memento object, directly. This can easily be
done in multiple ways

#### Extend The Memento

You can tell a model instance to extend a memento instance. This will provide all of
the memento methods directly on the model.

````
SomeModel = Backbone.Model.extend({
  initialize: function(){
    var memento = new Backbone.Memento(this);
    _.extend(this, memento);
  }
});

````

#### Cherry-Picking Methods

You can also configure a model by instantiating the memento with your model's 
initializer and then providing access to the methods as needed, or by using the 
methods internally.

````
SomeModel = Backbone.Model.extend({
  initialize: function(){
    this.memento = new Backbone.Memento(this);
    this.reset = this.memento.reset;
  },

  someAppMethod: function(){
    this.memento.set();
  },

  moreAppMethod: function(){
    this.memento.store();
    // ... do stuff here

    // ... then reset it if needed
    this.memento.restore();
  }
});
````

This gives you more control over where the memento methods can be used.

## Memento Methods

There are several methods provided by Backbone.Memento, to allow you more control over
how the memento object works, and when. 

### memento.store

This method creates a copy of your model's current state, as a memento, and stores it in
a stack (first in, last out). 

### memento.restore

This method takes the previously stored state, and restores your model to this state. You
can call this as many times as you have called `store`. Calling this method more times 
than you have called store will result in a no-operation and your model will not be
changed.

### memento.reset

This method effectively rolls your model back to the first store point, no matter how
many times it has been stored in the memento.

## Configuration

There is only one item of configuration for Backbone.Memento at the moment:

### Ignore Model Attributes

There are some scenarios where it may cause issues to have all attributes restored from
a previous state, for a model. In this case, you can ignore specific attributes for
the model.

#### Ignore For The Model Instance

You can configure the memento to ignore the attributes when instantiating the memento:

````
SomeModel = Backbone.Model.extend({
  initialize: function(){
    this.memento = new Backbone.Memento(this, {
      ignore: ["something", "another", "whatever", "..."]
    });
  },

  // ...
});

var someModel = new SomeModel();
someModel.set({something: "whatever"});
someModel.store();
someModel.set({something: "a change"});
someModel.restore();

someModel.get("something"); //=> "a change"
````

#### Ignore For This Restore Only

Alternatively, you can override the pre-configured ignored attributes by passing an
`ignore` array into the `restore` method:

````
SomeModel = Backbone.Model.extend({
  initialize: function(){
    this.memento = new Backbone.Memento(this);
  },

  // ...
});

var someModel = new SomeModel();
someModel.set({something: "whatever"});
someModel.store();
someModel.set({something: "a change"});
someModel.restore({ignore: ["something"]});

someModel.get("something"); //=> "a change"
````

Note that passing an `ignore` array into the `restore` method will override the pre-configured
ignore list.

## Examples

With this in place, you can push your model's state onto the memento stack by calling
`store`, and pop the previously stored state back into the model (destroying the current
state in the process) by calling `restore`. 

````
myModel = new SomeModel();
myModel.set({foo: "bar"});

myModel.store();

myModel.set({foo: "a change"});

myModel.restore();

myModel.get("foo"); // => "bar"
````

### Set And Unset Attributes

Backbone.Memento will set and unset attributes, when poping from the memento stack.
For example, if you add an attribute after storing your models state, and then later
restore back to the previous state, the attribute that you added will be unset. The
unset attribute will have it's change event fired, as well.

````
myModel = new SomeModel();
myModel.set({foo: "stuff"});

myModel.store();

myModel.set({bar: "a new attribute"});

myModel.bind("change:bar", function(model, value){
  alert('bar was changed to: ' + val);
}

myModel.restore(); // => causes an alert box to say "bar was changed to undefined"

myModel.get("bar"); // => undefined, as the attribute does not exist
````

# Release Notes

## v0.2.0

* changed the public memento API and how a model is connected to the memento
* changed the name of the 'clear' method to 'reset', to prevent hijacking the model's clear method
* updated the documentation to include better examples and more detail

## v0.1.4

* ability to ignore model attributes - they won't be stored or restored

## v0.1.3

* Fixed a small bug with rolling back more times than had been saved

## v0.1.2

* Added ability to `reset` a model, moving back to the beginning of the memento stack
* Fixed a few bugs in the removing of old attributes, related to global variables, etc
* Code cleanup and switching to a standard object constructor function instead of return an object literal

## v0.1 and v0.1.1

* Initial releases with a few minor bug fixes

# Legal Mumbo Jumbo (MIT License)

Copyright (c) 2011 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
