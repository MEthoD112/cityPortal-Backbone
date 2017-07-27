class EventsForCities {
    constructor() {
        this.wrapper = document.getElementById('wrapper');
        this.saveNewCity = document.getElementById('save-new-city');
        this.modalCity = document.getElementById('modal-city');
        this.saveNewButton = document.getElementById('add-new-city-button');
        this.errorEl = document.getElementById('city-error');

        // Add new City
        this.saveNewCity.addEventListener('click', (event) => {
            const modalLabel = document.getElementById('myModalLabel').getAttribute('data-mode');
            if (modalLabel === 'add') {
                this.saveNewCity.setAttribute('data-dismiss', 'modal');
                const city = this.getInfoFromModal();

                if (!this.validateCity(city)) {
                    this.saveNewCity.removeAttribute('data-dismiss');
                    return;
                }
                app.cities.push(city);
                localStorage.setItem('cities', JSON.stringify(app.cities));

                app.displayCities(city);
                app.clearSearchList();
                app.initSearchList(app.cities);
                app.clearCountriesList();
                app.initCountriesList(app.cities);
            }
        });

        // Open new city modal window
        this.saveNewButton.addEventListener('click', (event) => {
            const modalLabel = document.getElementById('myModalLabel');
            modalLabel.innerHTML = constants.addCity;
            modalLabel.setAttribute('data-mode', 'add');
            this.errorEl.innerHTML = '';
            document.getElementById('addnewcity').value = '';
            document.getElementById('addnewcountry').value = '';
            let isIndustrial = document.getElementById('i');
            let isCriminal = document.getElementById('c');
            let isPolluted = document.getElementById('p');
            isIndustrial.setAttribute('data-act', 'true');
            isIndustrial.style.background = constants.activeColor;
            isCriminal.setAttribute('data-act', 'false');
            isCriminal.style.background = constants.noActiveColor;
            isPolluted.setAttribute('data-act', 'false');
            isPolluted.style.background = constants.noActiveColor;
        });

        // Toogle buttons in new city modal window
        this.modalCity.addEventListener('click', (event) => {
            const id = event.target.id;
            if (id === 'c' || id === 'p' || id === 'i') {
                this.toogleColor(event.target);
            }
        });

        // Toogle buttons in main menu
        this.wrapper.addEventListener('click', (event) => {
            if (event.target.className === 'attributes') {
                const id = event.target.getAttribute('data-id');
                const attr = event.target.id.charAt(0);
                let index;

                app.cities.forEach((item, i) => {
                    if (item.id === +id) {
                        index = i;
                    }
                });

                if (attr === 'i') {
                    app.cities[index].isIndustrial = !app.cities[index].isIndustrial;
                } else if (attr === 'c') {
                    app.cities[index].isCriminal = !app.cities[index].isCriminal;
                } else {
                    app.cities[index].isPolluted = !app.cities[index].isPolluted;
                };

                localStorage.setItem('cities', JSON.stringify(app.cities));
                this.toogleColor(event.target);
            }
            
        });

        // Delete city
        this.wrapper.addEventListener('click', (event) => {
            if (event.target.className === 'delete-city') {
                const id = event.target.getAttribute('data-id');
                let index;

                app.cities.forEach((item, i) => {
                    if (item.id === +id) {
                        index = i;
                    }
                });
                this.removeCity(event.target);

                app.cities.splice(index, 1);
                localStorage.setItem('cities', JSON.stringify(app.cities));
                app.clearSearchList();
                app.initSearchList(app.cities);
                app.clearCountriesList();
                app.initCountriesList(app.cities);
            }
        });

        // Open modal window for edditing city
        this.wrapper.addEventListener('click', (event) => {
            if (event.target.className === 'edit-city') {
                const modalLabel = document.getElementById('myModalLabel');
                modalLabel.innerHTML = constants.editCity;
                modalLabel.setAttribute('data-mode', 'edit');
                this.errorEl.innerHTML = '';
                const id = event.target.getAttribute('data-id');
                this.element = event.target;
                app.cities.forEach((item, i) => {
                    if (item.id === +id) {
                        this.index = i;
                    }
                });
                this.name = app.cities[this.index].name;
                document.getElementById('addnewcity').value = app.cities[this.index].name;
                document.getElementById('addnewcountry').value = app.cities[this.index].country;
                document.getElementById('i').setAttribute('data-act', app.cities[this.index].isIndustrial);
                document.getElementById('c').setAttribute('data-act', app.cities[this.index].isCriminal);
                document.getElementById('p').setAttribute('data-act', app.cities[this.index].isPolluted);

                this.detectColor(document.getElementById('i'));
                this.detectColor(document.getElementById('c'));
                this.detectColor(document.getElementById('p'));
            }
        });

        // Save eddited city
        this.saveNewCity.addEventListener('click', (event) => {
            const modalLabel = document.getElementById('myModalLabel').getAttribute('data-mode');
            if (modalLabel === 'edit') {
                this.saveNewCity.setAttribute('data-dismiss', 'modal');
                const city = this.getInfoFromModal();

                if (!this.validateCity(city)) {
                    this.saveNewCity.removeAttribute('data-dismiss');
                    return;
                }
                const cityNameElement = this.element.nextElementSibling;
                cityNameElement.innerHTML = city.name;

                const parentNode = cityNameElement.parentNode;
                const attributesContainer = parentNode.children[parentNode.children.length - 1];

                attributesContainer.children[0].setAttribute('data-act', city.isIndustrial);
                attributesContainer.children[1].setAttribute('data-act', city.isCriminal);
                attributesContainer.children[2].setAttribute('data-act', city.isPolluted);

                this.detectColor(attributesContainer.children[0]);
                this.detectColor(attributesContainer.children[1]);
                this.detectColor(attributesContainer.children[2]);

                city.cityAreas = app.cities[this.index].cityAreas;
                city.id = app.cities[this.index].id;
                app.cities.splice(this.index, 1, city);
                localStorage.setItem('cities', JSON.stringify(app.cities));
                app.clearSearchList();
                app.initSearchList(app.cities);
                app.clearCountriesList();
                app.initCountriesList(app.cities);
            }
        });
    }

    // Detect color of toogled buttons
    detectColor(item) {
        if (item.getAttribute('data-act') === 'true') {
            item.style.background = constants.activeColor;
        } else {
            item.style.background = constants.noActiveColor;
        }
    }

    // Get info from modal window for new or eddited city
    getInfoFromModal() {
        let cityName = document.getElementById('addnewcity').value;
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

        let countryName = document.getElementById('addnewcountry').value;
        countryName = countryName.charAt(0).toUpperCase() + countryName.slice(1);

        let isIndustrial = document.getElementById('i').getAttribute('data-act');
        let isCriminal = document.getElementById('c').getAttribute('data-act');
        let isPolluted = document.getElementById('p').getAttribute('data-act');

        isIndustrial = isIndustrial === 'true' ? true : false;
        isCriminal = isCriminal === 'true' ? true : false;
        isPolluted = isPolluted === 'true' ? true : false;

        let id = app.cities.length ? app.cities[app.cities.length - 1].id + 1 : 0;

        const city = {
            id: id,
            country: countryName,
            name: cityName,
            isIndustrial: isIndustrial,
            isCriminal: isCriminal,
            isPolluted: isPolluted,
            cityAreas: []
        };

        return city;
    }

    // Validate new or editted city
    validateCity(city) {
        if (city.name === '') {
            this.errorEl.innerHTML = constants.alertMessageForCity;
            return false;
        }
        if (city.country === '') {
            this.errorEl.innerHTML = constants.alertMessageForCountry;
            return false;
        }
        if (city.name.length > constants.maxLengthForCityName) {
            city.name = city.name.slice(0, constants.maxLengthForCityName);
        }
        if (city.name === this.name) {
            this.name = undefined;
            return true;
        }
        const bool = app.cities.every((item) => {
            return item.name.toUpperCase() !== city.name.toUpperCase();
        });
        if (!bool) {
            this.errorEl.innerHTML = constants.alertMessageForExistingCity;
            return false;
        }
        return true;
    }

    // Toogle color of button attributes
    toogleColor(target) {
        if (target.getAttribute('data-act') === 'true') {
            target.style.background = constants.noActiveColor;
            target.setAttribute('data-act', 'false');
        } else {
            target.style.background = constants.activeColor;
            target.setAttribute('data-act', 'true');
        }
    }

    // Remove city
    removeCity(element) {
        let parent = element;
        while (parent.id !== 'accordion') {
            parent = parent.parentNode;
        }
        this.wrapper.removeChild(parent);
        return parent;
    }
}
