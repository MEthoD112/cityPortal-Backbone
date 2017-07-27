import $ from 'jquery';
import { _ } from 'underscore';

import { CityModel } from './citymodel';
import { CityView } from './cityviews';
import { citiesCollection } from './citycollections';
import { AreasList } from './areacollection';
import { AreaView } from './areaview';
import { AreaModel } from './areamodel';
import { constants } from './constants';

const AppView = Backbone.View.extend({

  el: "body",

  initialize: function () {
    var self = this;
    this.inputCity = this.$('#addnewcity');
    this.inputArea = this.$('#areaname');
    this.inputCountry = this.$('#addnewcountry');
    this.inputDescription = this.$('#areadescription');
    this.inputCitizenAmount = this.$('#areacitizens');

    citiesCollection.on('add', this.addAll, this);
    citiesCollection.on('reset', this.addAll, this);
    //citiesCollection.on('cityAreas:destroy', function() { 
    //    console.log('Change event on area');
    //});
    citiesCollection.fetch();
  },

  events: {
    'click #save-new-city': 'createCity',
    'click #add-new-area': 'getIdCityModel',
    'click #save-area': 'createArea',
    'click .delete-area': 'deleteArea'
  },

  getIdCityModel: function (event) {
    this.id = event.target.getAttribute('data-id');
  },

  deleteArea: function (event) {
    this.areaId = event.target.getAttribute('data-id');
    const cityParent = event.target.parentNode.parentNode.parentNode;
    const view = $(event.target).parent();
    this.cityId = cityParent.getAttribute('id').slice(5);
    citiesCollection.get(this.cityId).get('cityAreas').get(this.areaId).destroy();
    citiesCollection.get(this.cityId).save();
    view.remove();
  },

  createArea: function () {
    const model = this.createNewArea();
    citiesCollection.get(this.id).get('cityAreas').create(model);
    citiesCollection.get(this.id).save();
    const view = new AreaView({ model: model });
    const id = '#areas' + this.id;
    $(id).append(view.render().el);
  },

  addOneArea: function (area, id) {
    const view = new AreaView({ model: area });
    const Id = '#areas' + id;
    $(Id).append(view.render().el);
  },

  createCity: function () {
    if (!this.inputCity.val().trim()) {
      $('#city-error').html(constants.alertMessageForCity);
      return;
    }
    const bool = citiesCollection.toJSON().every((item) => {
      return item.name.toUpperCase() !== this.inputCity.val().toUpperCase();
    });

    if (!bool) {
      $('#city-error').html(constants.alertMessageForExistingCity);
      return;
    }
    if (!this.inputCountry.val().trim()) {
      $('#city-error').html(constants.alertMessageForCountry);
      return;
    }

    $('#myModal').modal('hide')
    citiesCollection.create(this.createNewCity(), { parse: true });
    this.inputCity.val('');
    this.inputCountry.val('');
    $('#city-error').html('');
  },

  addOne: function (city) {
    const view = new CityView({ model: city });
    $('#cities').append(view.render().el);
  },

  addAll: function () {
    this.$('#cities').html(''); // clean the todo list
    citiesCollection.each(this.addOne, this);
    for (let i = 0; i < citiesCollection.models.length; i++) {
      for (let j = 0; j < citiesCollection.models[i].get('cityAreas').models.length; j++) {
        this.addOneArea(citiesCollection.models[i].get('cityAreas').models[j], citiesCollection.models[i].attributes.id);
      }
    }
  },

  createNewCity: function () {
    return new CityModel({
      name: this.inputCity.val().trim(),
      country: this.inputCountry.val().trim()
    });
  },

  createNewArea: function () {
    return new AreaModel({
      name: this.inputArea.val().trim(),
      description: this.inputDescription.val().trim(),
      citizenAmount: this.inputCitizenAmount.val().trim()
    })
  }

});

export { AppView };
