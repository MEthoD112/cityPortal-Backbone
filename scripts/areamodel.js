import { _ } from 'underscore';

const AreaModel = Backbone.Model.extend({

    defaults: function () {
        return {
            id: _.uniqueId(),
            name: "Some Area",
            description: 'Some description',
            citizenAmount: 1
        }
    }
});

export { AreaModel };