
import $ from 'jquery';
import { _ } from 'underscore';

const AreaView = Backbone.View.extend({

  tagName: 'div',

  template: _.template($('#area-template').html()),

  initialize: function () {
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this);
  },

  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }

});

export { AreaView };