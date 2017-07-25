import { AreaModel } from './areamodel';
//import { _ } from 'underscore';
import LocalStorage from 'backbone.localstorage';

const AreasList = Backbone.Collection.extend({

    model: AreaModel,
    
    localStorage: new Backbone.LocalStorage("areas")
});

export { AreasList };
