import $ from 'jquery';
import { _ } from 'underscore';

import { CityModel } from './citymodel';
import { CityView } from './views';
import { citiesCollection } from './collections';
import { AreasList } from './areacollection';
import { AreaView } from './areaview';
import { AreaModel } from './areamodel';

const AppView = Backbone.View.extend({

  el: "body",

  initialize: function () {
    var self = this;
    this.input = this.$('#addnewcity');
    this.inputArea = this.$('#areaname');

    citiesCollection.on('add', this.addAll, this);
    //citiesCollection.on('change', this.addAll, this);
    citiesCollection.on('reset', this.addAll, this);
    citiesCollection.on('cityAreas:change', function() { 
        console.log('Change event on area');
        console.log(citiesCollection.toJSON());
    });
    citiesCollection.fetch();
  },

  events: {
    'click #save-new-city': 'createCityModel',
    'click #add-new-area': 'getCityModel',
    'click #save-area': 'createArea'
  },

  getCityModel: function(event) {
    this.id = event.target.getAttribute('data-id');
  },

  createArea: function() {
    citiesCollection.get(this.id).attributes.cityAreas.create(this.createNewArea());
    const view = new AreaView({model:this.createNewArea()});
    $('#areas').append(view.render().el);
  },

  createCityModel: function () {
    if (!this.input.val().trim()) {
      return;
    }
    citiesCollection.create(this.newAttributes(),{parse: true});
    this.input.val(''); // clean input box
  },

  addOne: function (city) {
    const view = new CityView({ model: city });
    $('#cities').append(view.render().el);
  },

  addAll: function () {
    this.$('#cities').html(''); // clean the todo list
    citiesCollection.each(this.addOne, this);
  },

  newAttributes: function () {
    return {
      name: this.input.val().trim(),
      country: 'Some country',
      isIndustrial: true,
      isCriminal: false,
      isPolluted: false
    } 
  },

  createNewArea: function() {
    return {
      name: this.inputArea.val().trim(),
      description: 'I am area',
      citizenAmount: 1
    }
  }

});

export { AppView };
