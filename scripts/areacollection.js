import { AreaModel } from './areamodel';
import LocalStorage from 'backbone.localstorage';

const AreasList = Backbone.Collection.extend({

    model: AreaModel,

    localStorage: new Backbone.LocalStorage('areas')
});

export { AreasList };
