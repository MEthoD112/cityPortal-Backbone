class EventsForAreas {
    constructor() {
        this.addNewAreaButton = document.getElementById('add-new-area');
        this.wrapper = document.getElementById('wrapper');
        this.saveArea = document.getElementById('save-area');
        this.errorEl = document.getElementById('area-error');

        // Open modal window for adding area
        this.wrapper.addEventListener('click', (event) => {
            if (event.target.id === 'add-new-area') {
                const modalLabel = document.getElementById('myModalLabelForEdit');
                modalLabel.innerHTML = constants.addArea;
                modalLabel.setAttribute('data-mode', 'add');
                this.errorEl.innerHTML = '';
                document.getElementById('areaname').value = '';
                document.getElementById('areadescription').value = '';
                document.getElementById('areacitizens').value = '';

                this.element = event.target;
                this.id = event.target.getAttribute('data-id');

                app.cities.forEach((item, i) => {
                    if (item.id === +this.id) {
                        this.index = i;
                    }
                });
            }
        });

        // Add new area
        this.saveArea.addEventListener('click', (event) => {
            const modalLabel = document.getElementById('myModalLabelForEdit').getAttribute('data-mode');
            if (modalLabel === 'add') {
                const area = this.getInfoFromModalForArea();
                const arr = app.cities[this.index].cityAreas;
                this.saveArea.setAttribute('data-dismiss', 'modal');

                if (!this.validateArea(area)) {
                    this.saveArea.removeAttribute('data-dismiss');
                    return;
                }
                area.id = arr.length ? arr[arr.length - 1].id + 1 : 0;
                const areaElement = this.formArea(area, this.id);

                const parent = this.element.parentNode.parentNode;
                parent.insertAdjacentHTML('beforeend', areaElement);

                const areaId = this.id + 'areas';

                const areasNameElement = document.getElementById(areaId);
                areasNameElement.innerHTML = areasNameElement.innerHTML === constants.noAreas ? area.name : areasNameElement.innerHTML + ', ' + area.name;

                app.cities[this.index].cityAreas.push(area);
                localStorage.setItem('cities', JSON.stringify(app.cities));
            }
        });

        // Delete area
        this.wrapper.addEventListener('click', (event) => {
            if (event.target.className === 'delete-area') {
                const areaId = event.target.getAttribute('data-id');
                const parent = event.target.parentNode;
                const parentOfParent = parent.parentNode;
                const cityId = parent.getAttribute('data-id');
                let indexCity, indexArea;

                app.cities.forEach((item, i) => {
                    if (item.id === +cityId) {
                        indexCity = i;
                    }
                });

                app.cities[indexCity].cityAreas.forEach((item, i) => {
                    if (item.id === +areaId) {
                        indexArea = i;
                    }
                });
                parentOfParent.removeChild(parent);
                app.cities[indexCity].cityAreas.splice(indexArea, 1);

                const id = cityId + 'areas';
                const areasName = document.getElementById(id);

                let areasNames = [];
                app.cities[indexCity].cityAreas.forEach((item => {
                    areasNames.push(item.name);
                }));
                areasNames = areasNames.length < 1 ? constants.noAreas : areasNames.join(', ');

                areasName.innerHTML = areasNames;
                
                localStorage.setItem('cities', JSON.stringify(app.cities));

            }
        });

        // Open modal window for editting area
        this.wrapper.addEventListener('click', (event) => {
            if (event.target.className === 'edit-area') {
                const modalLabel = document.getElementById('myModalLabelForEdit');
                modalLabel.innerHTML = constants.editArea;
                modalLabel.setAttribute('data-mode', 'edit');
                this.errorEl.innerHTML = '';
                
                const areaId = event.target.getAttribute('data-id');
                const parent = event.target.parentElement;
                const cityId = parent.getAttribute('data-id');
                this.element = event.target;

                app.cities.forEach((item, i) => {
                    if (item.id === +cityId) {
                        this.index = i;
                    }
                });

                app.cities[this.index].cityAreas.forEach((item, i) => {
                    if (item.id === +areaId) {
                        this.indexArea = i;
                    }
                });

                const area = app.cities[this.index].cityAreas[this.indexArea];
                this.name = area.name;

                document.getElementById('areaname').value = area.name;
                document.getElementById('areadescription').value = area.description;
                document.getElementById('areacitizens').value = area.citizenAmount;
            }
        });

        // Edit area
        this.saveArea.addEventListener('click', (event) => {
            const modalLabel = document.getElementById('myModalLabelForEdit').getAttribute('data-mode');
            if (modalLabel === 'edit') {
                this.saveArea.setAttribute('data-dismiss', 'modal');
                const area = this.getInfoFromModalForArea();

                if (!this.validateArea(area)) {
                    this.saveArea.removeAttribute('data-dismiss');
                    return;
                }
                area.id = app.cities[this.index].cityAreas[this.indexArea].id;
                
                const areaNameEl = this.element.nextElementSibling;
                const areaDescrEl = areaNameEl.nextElementSibling;
                const areaCitizenEl = areaDescrEl.nextElementSibling;

                areaNameEl.innerHTML = area.name;
                areaDescrEl.innerHTML = area.description;
                areaCitizenEl.innerHTML = area.citizenAmount;

                const id = app.cities[this.index].id + 'areas';
                const areasName = document.getElementById(id);

                app.cities[this.index].cityAreas[this.indexArea] = area;
                let areasNames = [];
                app.cities[this.index].cityAreas.forEach((item => {
                    areasNames.push(item.name);
                }));
                areasNames = areasNames.length < 1 ? constants.noAreas : areasNames.join(', ');

                areasName.innerHTML = areasNames;
                localStorage.setItem('cities', JSON.stringify(app.cities));

            }
        });
    }

    // Get info from modal window for new or eddited area
    getInfoFromModalForArea() {
        let areaName = document.getElementById('areaname').value;
        areaName = areaName.charAt(0).toUpperCase() + areaName.slice(1);
        let description = document.getElementById('areadescription').value;
        let citizenAmount = parseInt(document.getElementById('areacitizens').value);

        const area = {
            name: areaName,
            description: description,
            citizenAmount: citizenAmount,
        };

        return area;
    }

    // Validate new or eddited area
    validateArea(area) {
        if (area.name === '' || area.description === '' || area.citizenAmount === '') {
            this.errorEl.innerHTML = constants.alertMessageForAreaFields;
            return false;
        }
        if (area.name.length > 100) {
            area.name = area.name.slice(0, 100);
        }
        if (area.description.length > 250) {
            area.description = area.description.slice(0, 250);
        }
        if (!parseInt(area.citizenAmount) || parseInt(area.citizenAmount) < 1) {
            this.errorEl.innerHTML = constants.alertMessageForAreaCitizens;
            return false;
        }
        if (this.indexArea !== undefined && this.index !== undefined){
            if (area.name === this.name) {
                return true;
            }
        }
        const bool = app.cities[this.index].cityAreas.every((item) => {
            return item.name.toUpperCase() !== area.name.toUpperCase();
        });
        if (!bool) {
            this.errorEl.innerHTML = constants.alertMessageForExistingArea;
            return false;
        }    
        return true;
    }

    // Form HTMLElement for new area
    formArea(area, id) {
        const string = `<div class="areasdown" data-id=${ id }>
                            <button class="delete-area" data-id=${ area.id }></button>
                            <button class="edit-area" data-id=${ area.id } data-target="#areaModal" data-toggle="modal"></button>
                            <span class="areadown-name">${ area.name }</span>
                            <span class="description">${ area.description }</span>
                            <span class="citizenamount">${ area.citizenAmount + ' people' }</span>
                          </div>`;
        return string;                  
    }
}
