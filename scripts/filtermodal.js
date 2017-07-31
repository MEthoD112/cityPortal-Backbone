import $ from 'jquery';
import { constants } from './constants';
import { citiesCollection } from './citycollections'

export class FilterModal {
    constructor() {
        this.cityModal = $('#modal-city');
        this.filterAttr = $('#filter-attributes');
        this.dropDownButton = $('#dropdown-button');
        this.countriesError = $('#countries-error');
        this.inputMaxCitizens = $('#max-value-citizens');
        this.inputMinCitizens = $('#min-value-citizens');
        this.inputSearchCountry = $('#input-search-countries');
        this.attrError = $('#atrributes-error');
        this.citizError = $('#citizens-error');
        this.isIndustrilaAttr = $('#i-filter');
        this.isCriminalAttr = $('#c-filter');
        this.isPollutedAttr = $('#p-filter');

        // Event for toggling attributes in city modal window
        this.cityModal.on('click', (event) => {
            const id = event.target.id;
            if (id === 'c' || id === 'p' || id === 'i') {
                this.toggleColor(event.target);
            }
        });

        // Event for toggling attributes in filter window
        this.filterAttr.on('click', (event) => {
            const id = event.target.id;
            if (id === 'c-filter' || id === 'p-filter' || id === 'i-filter') {
                this.toggleColor(event.target);
            }
        });

        // Event for open filter window
        this.dropDownButton.on('click', () => {
            this.countriesError.html('');
            this.inputSearchCountry.val('');
            this.attrError.html('');
            this.citizError.html('');
            this.isIndustrilaAttr.attr('data-act', 'true');
            this.isCriminalAttr.attr('data-act', 'false');
            this.isPollutedAttr.attr('data-act', 'false');
            this.isIndustrilaAttr.css('background', constants.activeColor);
            this.isCriminalAttr.css('background', constants.noActiveColor);
            this.isPollutedAttr.css('background', constants.noActiveColor);
            const arrOfMinAndMax = this.findMinAndMaxValuesOfCitizens(citiesCollection);
            this.inputMaxCitizens.val(arrOfMinAndMax[1]);
            this.inputMinCitizens.val(arrOfMinAndMax[0]);
        });
    }

    // Toggle attributes
    toggleColor(target) {
        if (target.getAttribute('data-act') === 'true') {
            target.style.background = constants.noActiveColor;
            target.setAttribute('data-act', 'false');
        } else {
            target.style.background = constants.activeColor;
            target.setAttribute('data-act', 'true');
        }
    }

    // Find max and min value of citizens
    findMinAndMaxValuesOfCitizens(collection) {
        let arr = [];
        collection.each((item) => {
            item.get('cityAreas').each((item) => {
                if (item.get('citizenAmount')) {
                    arr.push(item.get('citizenAmount'))
                }
            });
        });

        arr.sort((a, b) => {
            return a - b;
        })
        return [arr[0], arr[arr.length - 1]];
    }
}
