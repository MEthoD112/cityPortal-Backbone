import { _ } from 'underscore';
import $ from 'jquery';

const AreaView = Backbone.View.extend({

  tagName: 'div',

  template: _.template($('#area-template').html()),

  initialize: function () {
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this); // remove: Convenience Backbone's function for removing the view from the DOM.
  }, 

  render: function () {
    console.log('render');
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  clear: function() {
    this.model.clear();
  }

});

export { AreaView };