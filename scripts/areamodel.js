const AreaModel = Backbone.Model.extend({

    defaults: function() {
      return  {
            name: "Some Area",
            description: 'Some description',
            citizenAmount: 1
      }
    },

    initialize: function () {
        if (!this.get("name")) {
            this.set({ "name": this.defaults.name });
        }
    },
    
    clear: function () {
        this.destroy();
    }
});

export { AreaModel };