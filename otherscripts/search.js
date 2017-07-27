class Search {
    constructor() {
        this.wrapper = document.getElementById('wrapper');
        this.searchButton = document.getElementById('search-button-cities');
        this.resetSearchButton = document.getElementById('reset-button-cities');
        this.searchButtonCountries = document.getElementById('search-country-button');
        this.wrapperForFilterAttr = document.getElementById('filter-attributes');
        this.dropDownButton = document.getElementById('dropdown-button');
        this.searchAttrButton = document.getElementById('search-attributes-button');
        this.dropDownWrapper = document.getElementById('dropdown-menu');
        this.searchForCitizens = document.getElementById('search-by-citizens');

        // Search for cities
        this.searchButton.addEventListener('click', () => {
            let searchInputValue = document.getElementById('input-search-cities').value;
            if (!searchInputValue) {
                return;
            }
            const city = app.cities.filter((item) => {
                if (item.name.toUpperCase() === searchInputValue.toUpperCase()) {
                    return item;
                }
            });
            this.showAlertOrRenderCities(constants.alertNoCities, city);
            document.getElementById('input-search-cities').value = '';
        });

        // Reset search
        this.resetSearchButton.addEventListener('click', () => {
            let searchInput = document.getElementById('input-search-cities');
            searchInput.value = '';
            app.clearDisplay();
            app.displayCities(app.cities);
        });

        // Search for countries
        this.searchButtonCountries.addEventListener('click', () => {
            const searchInputValue = document.getElementById('input-search-countries').value;
            if (!searchInputValue) {
                return;
            }
            const countries = app.cities.filter((item) => {
                if (item.country.toUpperCase() === searchInputValue.toUpperCase()) {
                    return item;
                }
            });
            this.clearFilterErrorMessages('countries-error', 'atrributes-error', 'citizens-error');
            this.showAlertOrRenderFilters(constants.alertNoCountries, countries, 'countries-error');
            document.getElementById('input-search-countries').value = '';
            
        });

        // Open dropdown window
        this.dropDownButton.addEventListener('click', () => {
            let isIndustrial = document.getElementById('i-filter');
            let isCriminal = document.getElementById('c-filter');
            let isPolluted = document.getElementById('p-filter');
            isIndustrial.setAttribute('data-act', 'true');
            isIndustrial.style.background = constants.activeColor;
            isCriminal.setAttribute('data-act', 'false');
            isCriminal.style.background = constants.noActiveColor;
            isPolluted.setAttribute('data-act', 'false');
            isPolluted.style.background = constants.noActiveColor;

            const minCitizensInput = document.getElementById('min-value-citizens');
            const maxCitizensInput = document.getElementById('max-value-citizens');
            const arrOfMinAndMax = this.findMinAndMaxValuesOfCitizens(app.cities);
            minCitizensInput.value = arrOfMinAndMax[0] || '';
            maxCitizensInput.value = arrOfMinAndMax[1] || '';
            this.clearFilterErrorMessages('countries-error', 'atrributes-error', 'citizens-error');
        });

        // Toogle attributes in filter window
        this.wrapperForFilterAttr.addEventListener('click', (event) => {
            const element = event.target;
            if (element.id === 'i-filter' || element.id === 'c-filter' || element.id === 'p-filter') {
                events.toogleColor(element);
            }
        });

        // Search for attributes
        this.searchAttrButton.addEventListener('click', () => {
            let isIndustrial = document.getElementById('i-filter').getAttribute('data-act');
            let isCriminal = document.getElementById('c-filter').getAttribute('data-act');
            let isPolluted = document.getElementById('p-filter').getAttribute('data-act');

            isIndustrial = isIndustrial === 'true' ? true : false;
            isCriminal = isCriminal === 'true' ? true : false;
            isPolluted = isPolluted === 'true' ? true : false;

            const cities = app.cities.filter((item) => {
                if (item.isIndustrial === isIndustrial &&
                    item.isCriminal === isCriminal &&
                    item.isPolluted === isPolluted) {
                    return item;
                }
            });
            this.clearFilterErrorMessages('countries-error', 'atrributes-error', 'citizens-error');
            this.showAlertOrRenderFilters(constants.alertNoCitiesWithAttr, cities, 'atrributes-error');
        });

        // Search for areas by citizens
        this.searchForCitizens.addEventListener('click', () => {
            const minCitizensValue = +document.getElementById('min-value-citizens').value;
            const maxCitizensValue = +document.getElementById('max-value-citizens').value;
            this.clearFilterErrorMessages('countries-error', 'atrributes-error', 'citizens-error');
            if (isNaN(minCitizensValue) || isNaN(maxCitizensValue)) {
                const errorEl = document.getElementById('citizens-error');
                errorEl.innerHTML = constants.alertForAreaFilter;
                return;
            }
            const cities = this.findAreasByRangeOfCitizens(minCitizensValue, maxCitizensValue);
            this.showAlertOrRenderFilters(constants.alertNoAreasWithSuchCitizens, cities, 'citizens-error');
        });
    }

    // Find minimal and maximum values of area citizens
    findMinAndMaxValuesOfCitizens(cities) {
        let arr = [];
        cities.forEach((item) => {
            item.cityAreas.forEach((item) => {
                if (item.citizenAmount) {
                    arr.push(item.citizenAmount)
                }
            });
        });

        arr.sort((a, b) => {
            return a - b;
        })
        return [arr[0], arr[arr.length - 1]];
    }

    // Find areas with amount of citizens in define range
    findAreasByRangeOfCitizens(min, max) {
        let arr = JSON.parse(JSON.stringify(app.cities));
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].cityAreas.length; j++) {
                if (arr[i].cityAreas[j].citizenAmount < min || arr[i].cityAreas[j].citizenAmount > max) {
                    arr[i].cityAreas.splice(j, 1);
                    j--;
                }
            }
        }
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i].cityAreas.length) {
                arr.splice(i, 1);
                i--;
            }
        }
        return arr;
    }

    // Render cities or show alert message
    showAlertOrRenderCities(message, cities) {
        app.clearDisplay();
        this.dropDownWrapper.classList.remove('open');

        if (!cities.length) {
            const string = `<div class="panel-group alert-no-search"><span>${message}<span></div>`;
            this.wrapper.insertAdjacentHTML('beforeend', string);
        } else {
            app.displayCities(cities);
        }
    }

    // Show alert or render cities by filters
    showAlertOrRenderFilters(message, cities, id) {
        if (!cities.length) {
            const errorEl = document.getElementById(id);
            errorEl.innerHTML = message;
        } else {
            app.clearDisplay();
            this.dropDownWrapper.classList.remove('open');
            app.displayCities(cities);
        }
    }

    // Clear error messages in filter window
    clearFilterErrorMessages() {
        for (let i = 0; i < arguments.length; i++) {
            let errorEL = document.getElementById(arguments[i]);
            errorEL.innerHTML = '';
        }
    }
}