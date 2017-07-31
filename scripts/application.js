import $ from 'jquery';
import { _ } from 'underscore';
const backboneDeepClone = require('backbonedeepclone');

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
    this.mainContainer = this.$('#cities')
    this.inputCity = this.$('#addnewcity');
    this.inputCountry = this.$('#addnewcountry');
    this.inputArea = this.$('#areaname');
    this.inputDescription = this.$('#areadescription');
    this.inputCitizenAmount = this.$('#areacitizens');
    this.saveCity = this.$('#save-new-city');
    this.saveArea = this.$('#save-area');
    this.errorCity = this.$('#city-error');
    this.errorArea = this.$('#area-error');
    this.errorCountry = this.$('#countries-error');
    this.errorAttr = this.$('#atrributes-error');
    this.errorCitizen = this.$('#citizens-error');
    this.cityModal = this.$('#myModal');
    this.areaModal = this.$('#areaModal');
    this.cityModalLabel = this.$('#myModalLabel');
    this.areaModalLabel = this.$('#myModalLabelForEdit');
    this.citiesList = this.$('#cities-list');
    this.countriesList = this.$('#countries-list');
    this.inputSearchCity = this.$('#input-search-cities');
    this.inputSearchCountry = this.$('#input-search-countries');
    this.dropDownButton = this.$('#dropdown-menu');
    this.isIndustrial = this.$('#i-filter');
    this.isCriminal = this.$('#c-filter');
    this.isPolluted = this.$('#p-filter');
    this.inputMaxCitizens = this.$('#max-value-citizens');
    this.inputMinCitizens = this.$('#min-value-citizens');

    citiesCollection.on('add', this.addAll, this);
    citiesCollection.on('reset', this.addAll, this);
    citiesCollection.fetch();
  },

  events: {
    'click #save-new-city': 'createOrEditCity',
    'click #save-area': 'createOrEditArea',
    'click .delete-area': 'deleteArea',
    'click .edit-city': 'openModalForEditCity',
    'click .edit-area': 'openModalForEditArea',
    'click #add-new-city-button': 'openModalForAddCity',
    'click #add-new-area': 'openModalForAddArea',
    'click #search-button-cities': 'renderFilteredCity',
    'click #reset-button-cities': 'resetFilter',
    'click #search-country-button': 'renderFilteredCitiesByCountry',
    'click #search-attributes-button': 'renderFilteredCitiesByAttr',
    'click #search-by-citizens': 'renderFilteredCitiesByCitizens'
  },

  // Render filtered collection by citizen amount
  renderFilteredCitiesByCitizens: function () {
    const min = this.inputMinCitizens.val();
    const max = this.inputMaxCitizens.val();
    let cities = this.filterByCitizens(min, max);
    if (!cities.length) {
      this.errorCitizen.html(constants.alertNoAreasWithSuchCitizens);
      return;
    }
    this.renderFiltered(cities);
  },

  // Filter collection by citizen amount
  filterByCitizens: function (min, max) {
    const clonedCollection = backboneDeepClone(citiesCollection);
    clonedCollection.__proto__ = citiesCollection.__proto__;
    for (let i = 0; i < clonedCollection.models.length; i++ ) {
      clonedCollection.models[i].__proto__ = citiesCollection.models[0].__proto__;
    }
    const filteredCollection = clonedCollection.filter((city) => {
      const col = city.get('cityAreas').filter((area) => {
        if (area.get('citizenAmount') >= min && area.get('citizenAmount') <= max) {
          return area;
        }
      });
      city.get('cityAreas').set(col);
      return city;
    });
    return filteredCollection.filter((city) => {
      if (city.get('cityAreas').length) {
        return city;
      }
    });
  },

  // Render filtered collection by attributes
  renderFilteredCitiesByAttr: function () {
    const cities = this.filterByAttr();
    if (!cities.length) {
      this.errorAttr.html(constants.alertNoCitiesWithAttr);
      return;
    }
    this.renderFiltered(cities);
  },

  // Filter collection by attributes
  filterByAttr: function () {
    return citiesCollection.filter((city) => {
      if (city.get('isIndustrial') + '' === this.isIndustrial.attr('data-act') &&
        city.get('isCriminal') + '' === this.isCriminal.attr('data-act') &&
        city.get('isPolluted') + '' === this.isPolluted.attr('data-act')) {
        return city;
      }
    });
  },

  // Render filtered collection by country
  renderFilteredCitiesByCountry: function () {
    if (!this.inputSearchCountry.val()) {
      return;
    }
    const city = this.filterByCountry();
    if (!city.length) {
      this.inputSearchCountry.val('');
      this.errorCountry.html(constants.alertNoCountries);
      return;
    }
    this.renderFiltered(city);
    this.inputSearchCountry.val('');
  },

  // Filter collection by country
  filterByCountry: function () {
    return citiesCollection.filter((city) => {
      if (city.get('country') === this.inputSearchCountry.val()) {
        return city;
      }
    });
  },

  // Reset filter
  resetFilter: function () {
    this.mainContainer.empty();
    this.addAll();
  },

  // Render filtered collection by city
  renderFilteredCity: function () {
    if (!this.inputSearchCity.val()) {
      return;
    }
    const city = this.filterByCity();
    if (!city.length) {
      this.inputSearchCity.val('');
      this.mainContainer.empty();
      this.mainContainer.html(`<h3 class="city-error">${constants.alertNoCities}</h3>`);
      return;
    }

    this.renderFiltered(city);
    this.inputSearchCity.val('');
  },

  // Filter collection by city
  filterByCity: function () {
    return citiesCollection.filter((city) => {
      if (city.get('name') === this.inputSearchCity.val()) {
        return city;
      }
    });
  },

  // Open modal window for adding area
  openModalForAddArea: function (event) {
    this.cityId = $(event.target).attr('data-id');
    this.saveArea.attr('data-mode', 'add');
    this.areaModalLabel.html(constants.addArea);
    this.errorArea.html('');
    this.inputArea.val('');
    this.inputDescription.val('');
    this.inputCitizenAmount.val('');
  },

  // Open modal window for edditin area
  openModalForEditArea: function (event) {
    this.areaId = $(event.target).attr('data-id');
    this.cityId = $(event.target).parent().parent().parent().attr('id').slice(5);
    this.saveArea.attr('data-mode', 'edit');
    this.areaModalLabel.html(constants.editArea);
    this.view = $(event.target).parent().parent();
    this.errorArea.html('');
    const model = citiesCollection.get(this.cityId).get('cityAreas').get(this.areaId);
    this.areaName = model.get('name');
    this.inputArea.val(model.get('name'));
    this.inputDescription.val(model.get('description'));
    this.inputCitizenAmount.val(model.get('citizenAmount'));
  },

  // Open modal window for adding city
  openModalForAddCity: function () {
    this.cityModalLabel.html(constants.addCity);
    this.inputCity.val('');
    this.inputCountry.val('');
    this.errorCity.html('');
    this.$('#i').attr('data-act', 'true');
    this.$('#c').attr('data-act', 'false');
    this.$('#p').attr('data-act', 'false');
    this.$('#i').css('background', constants.activeColor);
    this.$('#c').css('background', constants.noActiveColor);
    this.$('#p').css('background', constants.noActiveColor);
    this.saveCity.attr('data-mode', 'add');
  },

  // Open modal window for additin city
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

    this.$('#i').attr('data-act', isIndustrial);
    this.$('#c').attr('data-act', isCriminal);
    this.$('#p').attr('data-act', isPolluted);

    const iColor = isIndustrial ? constants.activeColor : constants.noActiveColor;
    const cColor = isCriminal ? constants.activeColor : constants.noActiveColor;
    const pColor = isPolluted ? constants.activeColor : constants.noActiveColor;

    this.$('#i').css('background', iColor);
    this.$('#c').css('background', cColor);
    this.$('#p').css('background', pColor);

    this.saveCity.attr('data-mode', 'edit');
  },

  // Delete area
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

  // Render created or edited area
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

  // Render one area
  addOneArea: function (area, id) {
    const view = new AreaView({ model: area });
    const Id = '#areas' + id;
    $(Id).append(view.render().el);
  },

  // Render created or eddited city
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
      this.countriesList.empty();
      this.initCountriesList(citiesCollection);
    }
    if (this.saveCity.attr('data-mode') === 'edit') {
      if (!this.validateCity('edit')) {
        return;
      }
      citiesCollection.get(this.id).set({
        name: this.inputCity.val(),
        country: this.inputCountry.val(),
        isIndustrial: this.$('#i').attr('data-act') === 'true' ? true : false,
        isCriminal: this.$('#c').attr('data-act') === 'true' ? true : false,
        isPolluted: this.$('#p').attr('data-act') === 'true' ? true : false,
        cityAreas: citiesCollection.get(this.id).get('cityAreas')
      });
      citiesCollection.get(this.id).get('cityAreas').each(this.addAllAreas, this);
      citiesCollection.each(this.initAreasList, this);
      this.citiesList.empty();
      this.initCitiesSearch(citiesCollection);
      this.countriesList.empty();
      this.initCountriesList(citiesCollection);
      citiesCollection.get(this.id).save();
      this.cityModal.modal('hide');
      this.errorCity.html('');
    }
  },

  // Render all areas for one city
  addAllAreas: function (model) {
    const view = new AreaView({ model: model });
    const id = '#areas' + this.id;
    $(id).append(view.render().el);
  },

  // Render one city
  addOne: function (city) {
    const view = new CityView({ model: city });
    this.mainContainer.append(view.render().el);
  },

  // Render all cities and areas when app starts
  addAll: function () {
    this.mainContainer.html('');
    this.citiesList.empty();
    this.countriesList.empty();
    citiesCollection.each(this.addOne, this);
    citiesCollection.each(this.initAreasList, this);
    this.initCitiesSearch(citiesCollection);
    this.initCountriesList(citiesCollection);
    for (let i = 0; i < citiesCollection.models.length; i++) {
      for (let j = 0; j < citiesCollection.models[i].get('cityAreas').models.length; j++) {
        this.addOneArea(citiesCollection.models[i].get('cityAreas').models[j], citiesCollection.models[i].attributes.id);
      }
    }
  },

  // Create new model for city
  createNewCity: function () {
    return new CityModel({
      name: this.inputCity.val().trim(),
      country: this.inputCountry.val().trim(),
      isIndustrial: this.$('#i').attr('data-act') === 'true' ? true : false,
      isCriminal: this.$('#c').attr('data-act') === 'true' ? true : false,
      isPolluted: this.$('#p').attr('data-act') === 'true' ? true : false
    });
  },

  // Create new model for area
  createNewArea: function () {
    return new AreaModel({
      name: this.inputArea.val().trim(),
      description: this.inputDescription.val().trim(),
      citizenAmount: parseInt(this.inputCitizenAmount.val().trim())
    })
  },

  // Validate created or eddited city
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

  // Validate created or eddited area
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

  // Rerender areas list for adding, edditin or deleting area
  initAreasList: function (model) {
    const areasArr = [];
    model.get('cityAreas').toJSON().forEach((item) => {
      areasArr.push(item.name);
    });
    const id = '#' + model.get('id') + 'areas';
    const string = areasArr.length ? areasArr.join(', ') : constants.noAreas;
    $(id).html(string);
  },

  // Rerender cities list in search datalist
  initCitiesSearch: function (collection) {
    collection.toJSON().forEach((item) => {
      const option = $('<option>').val(item.name);
      const id = item.id + 'option';
      this.citiesList.append(option.attr('id', id));
    });
  },

  // Rerender countries list in search datalist
  initCountriesList: function (collection) {
    const arr = [];
    collection.toJSON().forEach((item) => {
      if (arr.indexOf(item.country) === -1) {
        arr.push(item.country);
        const option = $('<option>').val(item.country);
        const id = item.id + 'country';
        this.countriesList.append(option.attr('id', id));
      }
    });
  },

  // Render filtered collection
  renderFiltered: function (collection) {
    this.mainContainer.empty();
    collection.forEach((item) => {
      this.addOne(item);
      this.id = item.get('id');
      item.get('cityAreas').each(this.addAllAreas, this);
      this.initAreasList(item);
    });
    this.dropDownButton.removeClass('open');
  }
});

export { AppView };
