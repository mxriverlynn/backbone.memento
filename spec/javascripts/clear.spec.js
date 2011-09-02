describe("clearing all mementos", function(){
  beforeEach(function(){
    this.model = new AModel();
  });

  describe("when clearing", function(){
    it("should restore to first memento given successive save points", function(){
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
      this.model.clear();
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

      this.model.clear();
      this.model.restore();

      expect(this.model.get('foo')).toBe('bar'); //should not be qux
    });

    it("should do nothing given no store point", function(){
      var changed = false;
      this.model.set({foo: "bar"});

      this.model.bind("change:foo", function(){
        changed = true;
      });
      this.model.clear();

      expect(this.model.get('foo')).toBe('bar');
      expect(changed).toBeFalsy();
    });
  });
});
