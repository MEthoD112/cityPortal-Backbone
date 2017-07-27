class initApp {
    constructor() {
        this.cities = JSON.parse(localStorage.getItem('cities')) || [];
        this.wrapper = document.getElementById('wrapper');
        this.cityList = document.getElementById('cities-list');
        this.countriesList = document.getElementById('countries-list');
    }

    // Method for initial rendering and rendering block of city with areas
    displayCities(cities) {
        if (!cities.join) {
            cities = [cities];
        }
        cities.forEach((item) => {
            let areasNames = [];
            let areas = '';

            const iColor = item.isIndustrial ? constants.activeColor : constants.noActiveColor;
            const cColor = item.isCriminal ? constants.activeColor : constants.noActiveColor;
            const pColor = item.isPolluted ? constants.activeColor : constants.noActiveColor;

            const iActive = item.isIndustrial ? 'true' : 'false';
            const cActive = item.isCriminal ? 'true' : 'false';
            const pActive = item.isPolluted ? 'true' : 'false';

            const iD = item.id;
            item.cityAreas.forEach((item) => {
                areasNames.push(item.name);
                areas += `<div class="areasdown" data-id=${iD}>
                            <button class="delete-area" data-id=${ item.id}></button>
                            <button class="edit-area" data-id=${ item.id} data-target="#areaModal" data-toggle="modal"></button>
                            <span class="areadown-name">${ item.name}</span>
                            <span class="description">${ item.description}</span>
                            <span class="citizenamount">${ item.citizenAmount + ' people'}</span>
                          </div>`;
            });
            areasNames = areasNames.length < 1 ? constants.noAreas : areasNames.join(', ');

            const string =
                `<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                    <div class="panel panel-default">
                        <div class="toggle-container" role="button" data-toggle="collapse" data-parent="#accordion" href=${ '#collapse' + item.id}
                                                                aria-expanded="false" aria-controls=${ 'collapse' + item.id}></div>
                        <div class="panel-heading" role="tab" id="headingOne">
                            <button class="delete-city" data-id=${ item.id}></button>
                            <button class="edit-city" data-id=${ item.id} data-target="#myModal" data-toggle="modal"></button>
                            
                            <a>
                                ${ item.name}
                            </a>
                            <div class="areas"><span id=${item.id + 'areas'}>${areasNames}</span></div>
                            <div class="marks">
                                <button id="i-button" data-id=${ item.id} style="background:${iColor}" class="attributes" data-act=${iActive}>I</button>
                                <button id="c-button" data-id=${ item.id} style="background:${cColor}" class="attributes" data-act=${cActive}>C</button>
                                <button id="p-button" data-id=${ item.id} style="background:${pColor}" class="attributes" data-act=${pActive}>P</button>
                            </div>    
                        </div>
                    <div id=${ 'collapse' + item.id} class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                        <div class="panel-body">
                            <div class="newarea">
                                <button type="button" class="newareabutton btn btn-primary btn-sm" id="add-new-area"
                                data-toggle="modal" data-target="#areaModal" data-id=${ item.id}>Add New Area</button>
                            </div>    
                            ${ areas}
                        </div>
                    </div>
                </div>
            </div>`;

            this.wrapper.insertAdjacentHTML('beforeend', string);
        });
    }

    // Method for removing all cities and areas
    clearDisplay() {
        let panels = this.wrapper.getElementsByClassName('panel-group');
        panels = [...panels];
        for (let i = 0; i < panels.length; i++) {
            this.wrapper.removeChild(panels[i]);
        }
    }

    // Init cities in search list
    initSearchList(cities) {
        cities.forEach((item) => {
            let string = `<option value="${item.name}"></option>`;
            this.cityList.insertAdjacentHTML('beforeend', string);
        });
    }

    // Clear cities in search list
    clearSearchList() {
        const children = [...this.cityList.children];
        for (let i = 0; i < children.length; i++) {
            this.cityList.removeChild(children[i]);
        }
    }

    // Init countries in search list
    initCountriesList(countries) {
        let countriesArr = [];
        countries.forEach((item) => {
            if (countriesArr.indexOf(item.country) === -1) {
                countriesArr.push(item.country);
            }
        });
        countriesArr.forEach((item) => {
            let string = `<option value="${item}"></option>`;
            this.countriesList.insertAdjacentHTML('beforeend', string);
        });
    }

    // Clear countries in search list
    clearCountriesList() {
        const children = [...this.countriesList.children];
        for (let i = 0; i < children.length; i++) {
            this.countriesList.removeChild(children[i]);
        }
    }
}