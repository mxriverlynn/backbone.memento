describe("restart all mementos", function(){
  beforeEach(function(){
    this.model = new AModel();
  });

  describe("when restarting", function(){
    it("should restart to first memento given successive save points", function(){
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
      this.model.restart();
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

      this.model.restart();
      this.model.restart();

      expect(this.model.get('foo')).toBe('bar'); //should not be qux
    });

    it("should do nothing given no store point", function(){
      var changed = false;
      this.model.set({foo: "bar"});

      this.model.bind("change:foo", function(){
        changed = true;
      });
      this.model.restart();

      expect(this.model.get('foo')).toBe('bar');
      expect(changed).toBeFalsy();
    });
  });
});
