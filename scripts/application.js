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
    this.inputCountry = this.$('#addnewcountry');
    this.isIndustrial = this.$('#i');
    this.isCriminal = this.$('#c');
    this.isPolluted = this.$('#p');

    this.inputArea = this.$('#areaname');
    this.inputDescription = this.$('#areadescription');
    this.inputCitizenAmount = this.$('#areacitizens');

    this.saveCity = this.$('#save-new-city');
    this.saveArea = this.$('#save-area');
    this.errorCity = this.$('#city-error');
    this.errorArea = this.$('#area-error');
    this.cityModal = this.$('#myModal');
    this.areaModal = this.$('#areaModal');
    this.cityModalLabel = this.$('#myModalLabel');
    this.areaModalLabel = this.$('#myModalLabelForEdit');
    this.citiesList = this.$('#cities-list');

    citiesCollection.on('add', this.addAll, this);
    citiesCollection.on('reset', this.addAll, this);
    citiesCollection.on('cityAreas:change', function() {
      console.log('Change Event');
     });
    citiesCollection.fetch();
  },

  events: {
    'click #save-new-city': 'createOrEditCity',
    'click #save-area': 'createOrEditArea',
    'click .delete-area': 'deleteArea',
    'click .edit-city': 'openModalForEditCity',
    'click .edit-area': 'openModalForEditArea',
    'click #add-new-city-button': 'openModalForAddCity',
    'click #add-new-area': 'openModalForAddArea'
  },

  openModalForAddArea: function (event) {
    this.cityId = $(event.target).attr('data-id');
    this.saveArea.attr('data-mode', 'add');
    this.areaModalLabel.html(constants.addArea);
    this.errorArea.html('');
    this.inputArea.val('');
    this.inputDescription.val('');
    this.inputCitizenAmount.val('');
  },

  openModalForEditArea: function (event) {
    this.areaId = $(event.target).attr('data-id');
    this.cityId = $(event.target).parent().parent().parent().attr('id').slice(5);
    this.saveArea.attr('data-mode', 'edit');
    this.areaModalLabel.html(constants.editArea);
    this.view = $(event.target).parent().parent();
    this.errorArea.html();
    const model = citiesCollection.get(this.cityId).get('cityAreas').get(this.areaId);
    this.areaName = model.get('name');
    this.inputArea.val(model.get('name'));
    this.inputDescription.val(model.get('description'));
    this.inputCitizenAmount.val(model.get('citizenAmount'));
  },

  openModalForAddCity: function () {
    this.cityModalLabel.html(constants.addCity);
    this.inputCity.val('');
    this.inputCountry.val('');
    this.errorCity.html('');
    this.isIndustrial.attr('data-act', 'true');
    this.isCriminal.attr('data-act', 'false');
    this.isPolluted.attr('data-act', 'false');
    this.isIndustrial.css('background', constants.activeColor);
    this.isCriminal.css('background', constants.noActiveColor);
    this.isPolluted.css('background', constants.noActiveColor);
    this.saveCity.attr('data-mode', 'add');
  },

  openModalForEditCity: function (event) {
    const cityId = $(event.target).attr('data-id');
    this.cityModal.modal('show');
    this.cityModalLabel.html(constants.editCity);
    this.errorCity.html('');
    this.id = $(event.target).attr('data-id');
    this.cityName = citiesCollection.get(cityId).get('name');
    this.inputCity.val(this.cityName);
    const countryName = citiesCollection.get(cityId).get('country');
    this.inputCountry.val(countryName);
    const isIndustrial = citiesCollection.get(cityId).get('isIndustrial');
    const isCriminal = citiesCollection.get(cityId).get('isCriminal');
    const isPolluted = citiesCollection.get(cityId).get('isPolluted');

    this.isIndustrial.attr('data-act', isIndustrial);
    this.isCriminal.attr('data-act', isCriminal);
    this.isPolluted.attr('data-act', isPolluted);

    const iColor = isIndustrial ? constants.activeColor : constants.noActiveColor;
    const cColor = isCriminal ? constants.activeColor : constants.noActiveColor;
    const pColor = isPolluted ? constants.activeColor : constants.noActiveColor;

    this.isIndustrial.css('background', iColor);
    this.isCriminal.css('background', cColor);
    this.isPolluted.css('background', pColor);

    this.saveCity.attr('data-mode', 'edit');
  },

  deleteArea: function (event) {
    this.areaId = event.target.getAttribute('data-id');
    const cityParent = event.target.parentNode.parentNode.parentNode;
    const view = $(event.target).parent().parent();
    this.cityId = cityParent.getAttribute('id').slice(5);
    citiesCollection.get(this.cityId).get('cityAreas').get(this.areaId).destroy();
    this.initAreasList(citiesCollection.get(this.cityId));
    citiesCollection.get(this.cityId).save();
    view.remove();
  },

  createOrEditArea: function (event) {
    if (this.saveArea.attr('data-mode') === 'add') {
      if (!this.validateArea()) {
        return;
      }
      const model = this.createNewArea();
      citiesCollection.get(this.cityId).get('cityAreas').create(model);
      this.initAreasList(citiesCollection.get(this.cityId));
      citiesCollection.get(this.cityId).save();
      const view = new AreaView({ model: model });
      const id = '#areas' + this.cityId;
      $(id).append(view.render().el);
      this.areaModal.modal('hide');
      this.errorArea.html('');
    }
    if (this.saveArea.attr('data-mode') === 'edit') {
      if (!this.validateArea('edit')) {
        return;
      }
      citiesCollection.get(this.cityId).get('cityAreas').get(this.areaId).set({
        name: this.inputArea.val(),
        description: this.inputDescription.val(),
        citizenAmount: parseInt(this.inputCitizenAmount.val()),
      });
      citiesCollection.get(this.cityId).get('cityAreas').get(this.areaId).save();
      this.initAreasList(citiesCollection.get(this.cityId));
      citiesCollection.get(this.cityId).save();
      this.areaModal.modal('hide');
      this.errorArea.html('');
      this.view.remove();
      this.addOneArea(citiesCollection.get(this.cityId).get('cityAreas').get(this.areaId), this.cityId);
    }
  },

  addOneArea: function (area, id) {
    const view = new AreaView({ model: area });
    const Id = '#areas' + id;
    $(Id).append(view.render().el);
  },

  createOrEditCity: function () {
    if (this.saveCity.attr('data-mode') === 'add') {
      if (!this.validateCity()) {
        return;
      }
      this.cityModal.modal('hide');
      const model = this.createNewCity();
      citiesCollection.create(model, { parse: true });
      this.errorCity.html('');
      this.initAreasList(model);
      this.citiesList.empty();
      this.initCitiesSearch(citiesCollection);
    }

    if (this.saveCity.attr('data-mode') === 'edit') {
      if (!this.validateCity('edit')) {
        return;
      }
      citiesCollection.get(this.id).set({
        name: this.inputCity.val(),
        country: this.inputCountry.val(),
        isIndustrial: this.isIndustrial.attr('data-act') === 'true' ? true : false,
        isCriminal: this.isCriminal.attr('data-act') === 'true' ? true : false,
        isPolluted: this.isPolluted.attr('data-act') === 'true' ? true : false
      });
      this.citiesList.empty();
      this.initCitiesSearch(citiesCollection);
      citiesCollection.get(this.id).save();
      this.cityModal.modal('hide');
      this.errorCity.html('');
    }
  },

  addOne: function (city) {
    const view = new CityView({ model: city });
    $('#cities').append(view.render().el);
  },

  addAll: function () {
    this.$('#cities').html('');
    this.citiesList.empty();
    citiesCollection.each(this.addOne, this);
    citiesCollection.each(this.initAreasList, this);
    this.initCitiesSearch(citiesCollection);
    for (let i = 0; i < citiesCollection.models.length; i++) {
      for (let j = 0; j < citiesCollection.models[i].get('cityAreas').models.length; j++) {
        this.addOneArea(citiesCollection.models[i].get('cityAreas').models[j], citiesCollection.models[i].attributes.id);
      }
    }
  },

  createNewCity: function () {
    return new CityModel({
      name: this.inputCity.val().trim(),
      country: this.inputCountry.val().trim(),
      isIndustrial: this.isIndustrial.attr('data-act') === 'true' ? true : false,
      isCriminal: this.isCriminal.attr('data-act') === 'true' ? true : false,
      isPolluted: this.isPolluted.attr('data-act') === 'true' ? true : false
    });
  },

  createNewArea: function () {
    return new AreaModel({
      name: this.inputArea.val().trim(),
      description: this.inputDescription.val().trim(),
      citizenAmount: parseInt(this.inputCitizenAmount.val().trim())
    })
  },

  validateCity: function (mode) {
    if (!this.inputCity.val().trim()) {
      this.errorCity.html(constants.alertMessageForCity);
      return false;
    }
    if (!this.inputCountry.val().trim()) {
      this.errorCity.html(constants.alertMessageForCountry);
      return false;
    }
    if (mode === 'edit') {
      if (this.cityName === this.inputCity.val()) {
        return true;
      }
    }
    const bool = citiesCollection.toJSON().every((item) => {
      return item.name.toUpperCase() !== this.inputCity.val().toUpperCase();
    });

    if (!bool) {
      this.errorCity.html(constants.alertMessageForExistingCity);
      return false;
    }
    return true;
  },

  validateArea: function (mode) {
    if (!this.inputArea.val().trim() ||
        !this.inputDescription.val().trim() ||
        !this.inputCitizenAmount.val().trim()) {
      this.errorArea.html(constants.alertMessageForAreaFields);
      return false;
    }
    if (!parseInt(this.inputCitizenAmount.val()) || parseInt(this.inputCitizenAmount.val()) < 1) {
      this.errorArea.html(constants.alertMessageForAreaCitizens);
      return false;
    }
    if (mode === 'edit') {
      if (this.areaName === this.inputArea.val()) {
        return true;
      }
    }
    if (citiesCollection.get(this.cityId).get('cityAreas').length <= 1) {
      return true;
    }
    const bool = citiesCollection.get(this.cityId).get('cityAreas').toJSON().every((item) => {
      return item.name.toUpperCase() !== this.inputArea.val().toUpperCase();
    });
    if (!bool) {
      this.errorArea.html(constants.alertMessageForExistingArea);
      return false;
    }
    return true;
  },

  initAreasList: function (model) {
    const areasArr = [];
    model.get('cityAreas').toJSON().forEach((item) => {
      areasArr.push(item.name);
    });
    const id = '#' + model.get('id') + 'areas';
    const string = areasArr.length ? areasArr.join(', ') : constants.noAreas;
    $(id).html(string);
  },

  initCitiesSearch: function (collection) {
    collection.toJSON().forEach((item) => {
      const option = $('<option>').val(item.name);
      const id = item.id + 'option';
      this.citiesList.append(option.attr('id', id));
    });
  }
});

export { AppView };
