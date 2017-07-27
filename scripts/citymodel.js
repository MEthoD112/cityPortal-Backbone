import { AreasList } from './areacollection';
import { _ } from 'underscore';

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
        this.get('cityAreas').on('change', this.cityAreasChange, this);
    },

    parse: function (response) {
        if (_.has(response, "cityAreas")) {
            this.attributes.cityAreas = new AreasList(response.cityAreas, { parse: true });
            delete response.cityAreas;
        }
        return response;
    },

    cityAreasChange: function (model) {
        this.trigger('cityAreas:change', this, model);
    },

    toggleIndustrial: function () {
        this.save({ isIndustrial: !this.get("isIndustrial") });
    },

    toggleCriminal: function () {
        this.save({ isCriminal: !this.get("isCriminal") });
    },

    togglePolluted: function () {
        this.save({ isPolluted: !this.get("isPolluted") });
    },

    clear: function () {
        this.destroy();
    }
});

export { CityModel };