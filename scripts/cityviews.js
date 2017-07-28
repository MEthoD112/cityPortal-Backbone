import { _ } from 'underscore';
import $ from 'jquery';

const CityView = Backbone.View.extend({

  tagName: 'div',

  template: _.template($('#city-template').html()),

  initialize: function () {
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this);
  },

  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  events: {
    "click #i-button": "toggleIndustrial",
    "click #c-button": "toggleCriminal",
    "click #p-button": "togglePolluted",
    "click .delete-city": "delete"
  },

  toggleIndustrial: function () {
    this.model.toggleIndustrial();
  },

  toggleCriminal: function () {
    this.model.toggleCriminal();
  },

  togglePolluted: function () {
    this.model.togglePolluted();
  },

  delete: function () {
    const id = '#' + this.model.get('id') + 'option';
    $(id).remove();
    const idCountry = '#' + this.model.get('id') + 'country';
    $(idCountry).remove();
    this.model.clear();
  }
});

export { CityView };
