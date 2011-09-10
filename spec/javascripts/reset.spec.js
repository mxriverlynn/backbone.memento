describe("reset all mementos", function(){
  beforeEach(function(){
    this.model = new AModel();
  });

  describe("when resetting", function(){
    it("should reset to first memento given successive save points", function(){
      var changed = false;
      this.model.set({foo: "bar"});
      this.model.store();
      this.model.set({foo: "baz"});
      this.model.store();
      this.model.set({foo: "qux"});
      this.model.store();

      this.model.bind("change:foo", function(){
        changed = true;
      });

      expect(this.model.get('foo')).toBe('qux');
      this.model.reset();
      expect(changed).toBeTruthy();
      expect(this.model.get('foo')).toBe('bar');
    });

    it("should lose all other save points", function(){
      var changed = false;
      this.model.set({foo: "bar"});
      this.model.store();
      this.model.set({foo: "baz"});
      this.model.store();
      this.model.set({foo: "qux"});
      this.model.store();

      this.model.reset();
      this.model.reset();

      expect(this.model.get('foo')).toBe('bar'); //should not be qux
    });

    it("should do nothing given no store point", function(){
      var changed = false;
      this.model.set({foo: "bar"});

      this.model.bind("change:foo", function(){
        changed = true;
      });
      this.model.reset();

      expect(this.model.get('foo')).toBe('bar');
      expect(changed).toBeFalsy();
    });
  });
});
