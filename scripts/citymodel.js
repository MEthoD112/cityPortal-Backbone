import { AreasList } from './areacollection';
import { _ } from 'underscore';
import { AreaView } from './areaview';
import { app } from './app';

const CityModel = Backbone.Model.extend({

    defaults: function () {
        return {
            id: this.id,
            name: "Some city",
            country: 'Some country',
            isIndustrial: true,
            isCriminal: false,
            isPolluted: false
        }
    },

    initialize: function () {
        _.defaults(this.attributes, {
            cityAreas: new AreasList()
        });
    },

    parse: function (response) {
        if (_.has(response, "cityAreas")) {
            this.attributes.cityAreas = new AreasList(response.cityAreas, { parse: true });
            delete response.cityAreas;
        }
        return response;
    },

    toggleIndustrial: function () {
        this.save({ isIndustrial: !this.get("isIndustrial") });
        this.addAllAreasAndInitAreasList();
    },

    toggleCriminal: function () {
        this.save({ isCriminal: !this.get("isCriminal") });
        this.addAllAreasAndInitAreasList();
    },

    togglePolluted: function () {
        this.save({ isPolluted: !this.get("isPolluted") });
        this.addAllAreasAndInitAreasList();
    },

    clear: function () {
        this.destroy();
    },

    addArea: function (model) {
        const view = new AreaView({ model: model });
        const id = '#areas' + this.idCity;
        $(id).append(view.render().el);
    },

    addAllAreasAndInitAreasList: function () {
        this.idCity = this.get('id');
        this.get('cityAreas').each(this.addArea, this);
        app.initAreasList(this);
    }
});

export { CityModel };