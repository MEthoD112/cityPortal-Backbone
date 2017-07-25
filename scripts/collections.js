import { CityModel } from './citymodel';
import LocalStorage from 'backbone.localstorage';

const CitiesList = Backbone.Collection.extend({

    model: CityModel,

    localStorage: new Backbone.LocalStorage("cities")
});

const citiesCollection = new CitiesList();

export { citiesCollection };
